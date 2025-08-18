// RegisterPage.js
import { useState } from 'react';
import styled from 'styled-components';

const FormSection = styled.section`
  max-width: 650px; margin: 3rem auto; background: #fff; padding: 2.5rem 3.5rem;
  border-radius: 10px; box-shadow: 0 2px 12px rgba(60,90,130,0.05);
  display: flex; flex-direction: column; gap: 1.3rem;
`;

const Label = styled.label`font-weight: 500; margin-bottom: 0.6rem;`;
const Input = styled.input`
  padding: 0.7rem 1rem; border-radius: 5px; border: 1px solid #d9e4ee; font-size: 1rem; margin-bottom: 1.2rem;
`;

export function RegisterPage() {
  const [members, setMembers] = useState([{name:'',email:'',collegeName:''}]);
  function addMember() {
    setMembers(prev => [...prev, {name:'',email:'',collegeName:''}]);
  }

  return (
    <FormSection>
      <Label>Team Name</Label>
      <Input placeholder="Enter team name" />
      <Label>User Name</Label>
      <Input placeholder="Your name" />
      <Label>Team Members</Label>
      {members.map((mem, i) => (
        <div key={i} style={{display:'flex',gap:'1rem',marginBottom:'1rem'}}>
          <Input placeholder="Name" style={{width:'28%'}} />
          <Input placeholder="Email" style={{width:'28%'}}/>
          <Input placeholder="College" style={{width:'40%'}}/>
        </div>
      ))}
      <button
        type="button"
        onClick={addMember}
        style={{
          padding:'0.4rem 1.3rem',
          background:'#e7f0fd',
          border:'none',borderRadius:'3px',
          color:'#357cf7',fontWeight:'600',cursor:'pointer',marginBottom:'1.5rem'
        }}>Invite Member</button>
      <button
        type="submit"
        style={{
          padding:'0.9rem 2.5rem',
          background:'#357cf7', color:'white',
          fontWeight:'700', border:'none',borderRadius:'7px', fontSize:'1.2rem', marginTop:'1rem',
          cursor:'pointer'
        }}>Submit Registration</button>
    </FormSection>
  );
}
