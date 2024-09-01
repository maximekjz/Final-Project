import React, { useState } from 'react';
import axios from 'axios';
import { leagues as predefinedLeagues } from '../constants/leagues';

const LeagueManager: React.FC = () => {
  const [name, setName] = useState('');
  const [championship, setChampionship] = useState<number | ''>('');
  const [maxTeams, setMaxTeams] = useState(10);
  const [numMatchdays, setNumMatchdays] = useState(20);
  const [message, setMessage] = useState<string | null>(null);
  const userId = Number(localStorage.getItem('id')) || 1; 

  const handleCreateLeague = async () => {
    if (championship === '') {
      setMessage('Please select a championship.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/leagues/create', {
        name,
        championship_id: championship,
        max_teams: maxTeams,
        created_by: userId,
        num_matchdays: numMatchdays,
      });
      setMessage(`League created successfully! League code: ${response.data.leagueCode}`);
    } catch (error) {
      console.error('Error during the league creation:', error);
      setMessage('Error during the league creation.');
    }
  };

  return (
    <>
    <div>
      <h2>Create a new league</h2>
      <input
        type="text"
        placeholder="League Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={championship} onChange={(e) => setChampionship(Number(e.target.value))}>
        <option value="">Select a championship</option>
        {predefinedLeagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>
      <select value={maxTeams} onChange={(e) => setMaxTeams(Number(e.target.value))}>
        <option value={5}>5 Teams</option>
        <option value={10}>10 Teams</option>
      </select>
      <select value={numMatchdays} onChange={(e) => setNumMatchdays(Number(e.target.value))}>
        <option value={5}>5 Matchdays</option>
        <option value={10}>10 Matchdays</option>
        <option value={15}>15 Matchdays</option>
        <option value={20}>20 Matchdays</option>
      </select>
      <button onClick={handleCreateLeague}>Create the league</button>
      {message && <p>{message}</p>}
    </div>
    <div>
      <h2>My Leagues</h2>
        
    </div>
    </>
  );
};

export default LeagueManager;
