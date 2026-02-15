// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IHLUSD {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract PayStream is ReentrancyGuard {

    IHLUSD public hlusd;
    address public taxVault;
    address public admin;
    uint256 public taxRate; // fixed percentage (e.g. 5 = 5%)
    bool public emergencyStopped; // circuit breaker

    struct Stream {
        address sender;
        address recipient;
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        bool active;
        bool paused;
    }

    mapping(uint256 => Stream) public streams;
    mapping(uint256 => uint256) public withdrawn; // track withdrawn amount per stream
    uint256 public streamCount;

    // Employee registry for self-service onboarding
    mapping(address => bool) public employees;

    event StreamCreated(uint256 indexed id, address sender, address recipient, uint256 amount, uint256 startTime, uint256 endTime);
    event StreamPaused(uint256 indexed id);
    event StreamResumed(uint256 indexed id);
    event StreamStopped(uint256 indexed id);
    event BonusPaid(address indexed employee, uint256 amount);
    event EmployeeOnboarded(address indexed employee);
    event EmergencyStopActivated();
    event EmergencyStopReleased();

    constructor(address _hlusd, address _taxVault, uint256 _taxRate) {
        hlusd = IHLUSD(_hlusd);
        taxVault = _taxVault;
        taxRate = _taxRate;
        admin = msg.sender;
        emergencyStopped = false;
    }

    modifier notStopped() {
        require(!emergencyStopped, "Contract is stopped");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    // Self-service onboarding
    function onboardEmployee() external {
        require(!employees[msg.sender], "Already onboarded");
        employees[msg.sender] = true;
        emit EmployeeOnboarded(msg.sender);
    }

    // Create a new payment stream
    function createStream(address recipient, uint256 amount, uint256 startTime, uint256 endTime) public onlyAdmin notStopped {
        require(employees[recipient], "Recipient not onboarded");
        require(amount > 0, "Amount must be > 0");
        require(endTime > startTime, "Invalid schedule");

        uint256 tax = (amount * taxRate) / 100;
        uint256 netAmount = amount - tax;

        require(hlusd.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        streams[streamCount] = Stream(
            msg.sender,
            recipient,
            netAmount,
            startTime,
            endTime,
            true,
            false
        );

        require(hlusd.transfer(taxVault, tax), "Tax transfer failed");

        emit StreamCreated(streamCount, msg.sender, recipient, netAmount, startTime, endTime);

        streamCount++;
    }

    // Batch management
    function createBatchStreams(address[] calldata recipients, uint256[] calldata amounts, uint256 startTime, uint256 endTime) external onlyAdmin notStopped {
        require(recipients.length == amounts.length, "Mismatched arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            createStream(recipients[i], amounts[i], startTime, endTime);
        }
    }

    // Scheduled bonuses
    function payBonus(address employee, uint256 amount) external onlyAdmin notStopped {
        require(employees[employee], "Not onboarded");
        require(amount > 0, "Invalid bonus");

        require(hlusd.transferFrom(msg.sender, employee, amount), "Bonus transfer failed");

        emit BonusPaid(employee, amount);
    }

    // Calculate withdrawable amount
    function calculateWithdrawable(uint256 id) public view returns (uint256) {
        Stream memory s = streams[id];

        if (!s.active || s.paused) return 0;
        if (block.timestamp <= s.startTime) return 0;

        uint256 elapsed;

        if (block.timestamp >= s.endTime) {
            elapsed = s.endTime - s.startTime;
        } else {
            elapsed = block.timestamp - s.startTime;
        }

        uint256 duration = s.endTime - s.startTime;
        uint256 totalEarned = (s.amount * elapsed) / duration;

        return totalEarned;
    }

    // Withdraw earned salary
    function withdraw(uint256 id) external nonReentrant notStopped {
        Stream storage s = streams[id];

        require(msg.sender == s.recipient, "Not recipient");
        require(s.active, "Stream inactive");

        uint256 totalEarned = calculateWithdrawable(id);
        uint256 amountToSend = totalEarned - withdrawn[id];

        require(amountToSend > 0, "Nothing to withdraw");

        withdrawn[id] += amountToSend;

        require(hlusd.transfer(s.recipient, amountToSend), "Transfer failed");
    }

    // Pause stream
    function pauseStream(uint256 id) external notStopped {
        Stream storage s = streams[id];

        require(s.active, "Stream not active");
        require(msg.sender == s.sender, "Only sender can pause");

        s.paused = true;

        emit StreamPaused(id);
    }

    // Resume stream
    function resumeStream(uint256 id) external notStopped {
        Stream storage s = streams[id];

        require(s.active, "Stream not active");
        require(msg.sender == s.sender, "Only sender can resume");

        s.paused = false;

        emit StreamResumed(id);
    }

    // Stop stream and refund remaining
    function stopStream(uint256 id) external notStopped {
        Stream storage s = streams[id];

        require(s.active, "Stream not active");
        require(msg.sender == s.sender, "Only sender can stop");

        uint256 earned = calculateWithdrawable(id);
        uint256 remaining = s.amount - earned;

        s.active = false;

        if (remaining > 0) {
            require(hlusd.transfer(s.sender, remaining), "Refund failed");
        }

        emit StreamStopped(id);
    }

    // Emergency stop
    function activateEmergencyStop() external {
        require(msg.sender == taxVault, "Only vault can stop");
        emergencyStopped = true;
        emit EmergencyStopActivated();
    }

    function releaseEmergencyStop() external {
        require(msg.sender == taxVault, "Only vault can release");
        emergencyStopped = false;
        emit EmergencyStopReleased();
    }

    // Transfer admin role
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
    }
}
