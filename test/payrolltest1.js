const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PayStream Contract - Full Test Suite", function () {
  let payStream;
  let token;
  let admin;
  let employee;
  let employee2;
  let taxVault;

  const TAX_PERCENT = 10;

  beforeEach(async function () {
    [admin, employee, employee2, taxVault] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockHLUSD");
    token = await Token.deploy();
    await token.waitForDeployment();

    const PayStream = await ethers.getContractFactory("PayStream");
    payStream = await PayStream.deploy(
      await token.getAddress(),
      taxVault.address,
      TAX_PERCENT
    );
    await payStream.waitForDeployment();

    await payStream.connect(employee).onboardEmployee();

    await token.approve(
      await payStream.getAddress(),
      ethers.parseEther("1000")
    );
  });

  // --------------------------------------------------
  // EMPLOYEE TESTS
  // --------------------------------------------------

  it("Should onboard employee", async function () {
    expect(await payStream.employees(employee.address)).to.equal(true);
  });

  it("Should reject non-onboarded employee stream", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;

    await expect(
      payStream.createStream(
        employee2.address,
        ethers.parseEther("100"),
        now + 10,
        now + 100
      )
    ).to.be.reverted;
  });

  // --------------------------------------------------
  // ACCESS CONTROL
  // --------------------------------------------------

  it("Only admin can create stream", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;

    await expect(
      payStream.connect(employee).createStream(
        employee.address,
        ethers.parseEther("100"),
        now + 10,
        now + 100
      )
    ).to.be.reverted;
  });

  it("Only tax vault can activate emergency stop", async function () {
    await expect(
      payStream.connect(employee).activateEmergencyStop()
    ).to.be.reverted;
  });

  // --------------------------------------------------
  // STREAM CREATION VALIDATION
  // --------------------------------------------------

  it("Should reject invalid time range", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;

    await expect(
      payStream.createStream(
        employee.address,
        ethers.parseEther("100"),
        now + 100,
        now + 10
      )
    ).to.be.reverted;
  });

  // --------------------------------------------------
  // WITHDRAW TESTS
  // --------------------------------------------------

  it("Should allow partial withdraw after time passes", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const start = now + 1;
    const end = now + 100;

    await payStream.createStream(
      employee.address,
      ethers.parseEther("100"),
      start,
      end
    );

    await ethers.provider.send("evm_increaseTime", [50]);
    await ethers.provider.send("evm_mine");

    await payStream.connect(employee).withdraw(0);

    const balance = await token.balanceOf(employee.address);
    expect(balance).to.be.gt(0n);
  });

  it("Should prevent double withdraw properly", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const start = now + 1;
    const end = now + 100;

    await payStream.createStream(
      employee.address,
      ethers.parseEther("100"),
      start,
      end
    );

    // Move forward half duration
    await ethers.provider.send("evm_increaseTime", [50]);
    await ethers.provider.send("evm_mine");

    // First withdraw
    await payStream.connect(employee).withdraw(0);

    // Move to end of stream
    await ethers.provider.send("evm_increaseTime", [100]);
    await ethers.provider.send("evm_mine");

    // Withdraw remaining
    await payStream.connect(employee).withdraw(0);

    // Now fully drained — should revert
    await expect(
      payStream.connect(employee).withdraw(0)
    ).to.be.reverted;
  });

  it("Should block withdraw if paused", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const start = now + 1;
    const end = now + 100;

    await payStream.createStream(
      employee.address,
      ethers.parseEther("100"),
      start,
      end
    );

    await payStream.pauseStream(0);

    await expect(
      payStream.connect(employee).withdraw(0)
    ).to.be.reverted;
  });

  // --------------------------------------------------
  // PAUSE / RESUME
  // --------------------------------------------------

  it("Should pause and resume stream", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const start = now + 1;
    const end = now + 100;

    await payStream.createStream(
      employee.address,
      ethers.parseEther("100"),
      start,
      end
    );

    await payStream.pauseStream(0);
    await payStream.resumeStream(0);

    const stream = await payStream.streams(0);
    expect(stream.paused).to.equal(false);
  });

  // --------------------------------------------------
  // STOP STREAM
  // --------------------------------------------------

  it("Should stop stream and refund remaining tokens", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const start = now + 1;
    const end = now + 100;

    await payStream.createStream(
      employee.address,
      ethers.parseEther("100"),
      start,
      end
    );

    await ethers.provider.send("evm_increaseTime", [20]);
    await ethers.provider.send("evm_mine");

    const adminBalanceBefore = await token.balanceOf(admin.address);

    await payStream.stopStream(0);

    const adminBalanceAfter = await token.balanceOf(admin.address);

    expect(adminBalanceAfter).to.be.gt(adminBalanceBefore);
  });

  // --------------------------------------------------
  // EMERGENCY STOP
  // --------------------------------------------------

  it("Emergency stop should block withdrawals", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const start = now + 1;
    const end = now + 100;

    await payStream.createStream(
      employee.address,
      ethers.parseEther("100"),
      start,
      end
    );

    await payStream.connect(taxVault).activateEmergencyStop();

    await expect(
      payStream.connect(employee).withdraw(0)
    ).to.be.reverted;
  });
});



