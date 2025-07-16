// app/layout.js
import './globals.css';

export const metadata = {
  title: 'CMS Platform',
  description: 'A simple CMS platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
