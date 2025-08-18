// CompetitionListPage.js
import { useState } from 'react';
import styled from 'styled-components';

const Layout = styled.div`display: flex; gap: 2rem; padding: 2rem;`;
const Sidebar = styled.div`width: 350px;`;
const Main = styled.div`flex: 1; background: #f8f9fc; border-radius: 8px; padding: 2rem;`;

const SearchBar = styled.input`
  width: 220px; padding: 0.6rem 0.9rem; border-radius: 5px; border: 1px solid #d9e4ee; margin-bottom: 1rem;
  font-size: 1rem;
`;

const FilterButton = styled.button`
  padding: 0.55rem 1.2rem; border-radius: 5px; background: #357cf7; color: white; font-weight: 500; border: none;
  margin-left: 0.7rem; margin-bottom: 1rem; cursor: pointer;
`;

const CompetitionCard = styled.div`
  background: #fff; margin-bottom: 1.1rem; padding: 1rem; border-radius: 8px;
  box-shadow: 0 1px 5px rgba(60,90,130,0.08);
  display: flex; flex-direction: column; cursor: pointer;
  &:hover { border-left: 4px solid #357cf7; }
`;

const Img = styled.img`
  width: 60px; height: 60px; border-radius: 8px; margin-bottom: 0.7rem; object-fit: cover;
`;

const DetailHeading = styled.h2`color: #234185; margin-bottom: 1.2rem;`;

export function CompetitionsPage({ competitions }) {
  const [selected, setSelected] = useState(null);

  return (
    <Layout>
      <Sidebar>
        <div>
          <SearchBar placeholder="Search competitions" />
          <FilterButton>Filter</FilterButton>
        </div>
        {competitions.map(c => (
          <CompetitionCard key={c.id} onClick={() => setSelected(c)}>
            <Img src={c.image} alt={c.name}/>
            <div>
              <b>{c.name}</b><br/>
              <small>Date: {c.date}</small><br/>
              <small>Status: {c.status} | Mode: {c.mode}</small>
            </div>
          </CompetitionCard>
        ))}
      </Sidebar>
      <Main>
        {selected ? (
          <>
            <DetailHeading>{selected.title}</DetailHeading>
            <p>{selected.description}</p>
            <ul>
              <li><b>Theme:</b> {selected.theme}</li>
              <li><b>Tracks:</b> {selected.tracks.join(', ')}</li>
              <li><b>Rules:</b> {selected.rules}</li>
              <li><b>Timeline:</b> {selected.timeline}</li>
              <li><b>Prizes:</b> {selected.prizes}</li>
              <li><b>Sponsors:</b> {selected.sponsors}</li>
              <li><b>Supports:</b> {selected.mode}</li>
            </ul>
            <button style={{
                background:'#357cf7',
                color:'white',
                padding:'0.8rem 1.6rem',
                borderRadius:'7px',
                fontWeight:'600',
                fontSize:'1.1rem',
                border:'none',
                marginTop:'2rem',
                cursor:"pointer"
            }}>Register</button>
          </>
        ): (
          <h3>Select a competition to view details</h3>
        )}
      </Main>
    </Layout>
  );
}
