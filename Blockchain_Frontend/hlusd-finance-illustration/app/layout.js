import './globals.css';

export const metadata = {
  title: 'HLUSD Payroll Dashboard',
  description: 'HLUSD payroll dashboard built with Next.js and React',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
