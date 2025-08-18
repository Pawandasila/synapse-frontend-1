// src/app/page.js

export default function Page() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '2rem',
        padding: '2rem 3rem',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <button style={{
          background: 'none',
          border: 'none',
          fontSize: '1.1rem',
          color: '#234185',
          cursor: 'pointer',
          fontWeight: '600'
        }}>Competitions</button>
        <button style={{
          background: 'none',
          border: 'none',
          fontSize: '1.1rem',
          color: '#234185',
          cursor: 'pointer',
          fontWeight: '600'
        }}>Hosting</button>
        <button style={{
          background: 'none',
          border: 'none',
          fontSize: '1.1rem',
          color: '#234185',
          cursor: 'pointer',
          fontWeight: '600'
        }}>Login/Signup</button>
      </nav>

      {/* Main Section */}
      <section style={{
        display: 'flex',
        height: '70vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{
          color: '#234185',
          fontSize: '3rem'
        }}>
          Welcome to [Your Platform Name]
        </h1>
      </section>
    </div>
  );
}
