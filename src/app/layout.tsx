// src/app/layout.tsx
import './globals.css';  // your global styles, if any
import Navbar from './Navbar';

export const metadata = {
  title: 'Your App Title',
  description: 'Your app description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
