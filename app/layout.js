
import './globals.css';

export const metadata = {
  title: 'CMS Platform',
  description: 'Career and Leads Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
