// LandingPage.js
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  gap: 2rem;
  padding: 2rem 3rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
`;

const NavItem = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #234185;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    color: #357cf7;
  }
`;

export function LandingPage() {
  return (
    <div>
      <Nav>
        <NavItem>Competitions</NavItem>
        <NavItem>Hosting</NavItem>
        <NavItem>Login/Signup</NavItem>
      </Nav>
      <section style={{display: 'flex', height: '70vh', alignItems: 'center', justifyContent: 'center'}}>
        <h1 style={{color: '#234185', fontSize: '3rem'}}>Welcome to [Your Platform Name]</h1>
      </section>
    </div>
  );
}
