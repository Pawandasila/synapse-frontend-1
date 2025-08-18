import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '2rem',
      padding: '2rem 3rem',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
    }}>
      <Link href="/" style={{ fontWeight: '600', fontSize: '1.1rem', color: '#234185', textDecoration: 'none' }}>Home</Link>
      <Link href="components/competitionsPage" style={{ fontWeight: '600', fontSize: '1.1rem', color: '#234185', textDecoration: 'none' }}>Competitions</Link>
      <Link href="/hosting" style={{ fontWeight: '600', fontSize: '1.1rem', color: '#234185', textDecoration: 'none' }}>Hosting</Link>
      <Link href="/login" style={{ fontWeight: '600', fontSize: '1.1rem', color: '#234185', textDecoration: 'none' }}>Login/Signup</Link>
    </nav>
  );
}
