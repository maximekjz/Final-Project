import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { leagues as predefinedLeagues } from '../constants/leagues';
import { getFromLocalStorage, saveToLocalStorage } from '../../../storageUtil';
// import { fetchLeagues } from '../actions/leagueActions';

const TeamManager: React.FC = () => {
  const [name, setName] = useState('');
  const [matchDay, seMatchday] = useState(20);
  const [message, setMessage] = useState<string | null>(null);
  const [messageJoin, setMessageJoin] = useState<string | null>(null);
  const [league_id, setLeague_id] = useState<string>('');
  const [league, setLeague] = useState<string>('');
  const [myteams, setMyTeams] = useState<any[]>([]); 
  const userId = Number(getFromLocalStorage('userId')); 

  useEffect(() => {
  
    
    const fetchMyTeams = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/teams/show', {
          params: { user_id: userId },
        });
        setMyTeams(response.data);
      } catch (error) {
        console.error('Error fetching my leagues:', error);
      }
    };

    fetchMyTeams();
  }, [userId]);

  const handleCreateTeam = async () => {
    if (league_id === '') {
      setMessage('Please select a league_id.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/teams/create', {
        name,
        league_id: league_id,
        created_by: userId,
        matchDay: matchDay,
      });

    //   const { leagueId, league_id } = response.data;

      setMessage(`Team created successfully!`);

    } catch (error) {
      console.error('Error during the league creation:', error);
      setMessage('Error during the league creation.');
    }
  };

  
  return (
    <>
    <div>
      <h2>Create a new team</h2>
      <input
        type="text"
        placeholder="Team Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={league_id} onChange={(e) => setLeague_id((e.target.value))}>
        <option value="">Select a league</option>
        {predefinedLeagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>
      <button onClick={handleCreateTeam}>Create the team</button>
      {message && <p>{message}</p>}
    </div>
    <div>
      <h2>My Teams</h2>
      <select value="" onChange={(e) => setLeague((e.target.value))}>
        <option value="">Select a championship</option>
        {myteams.map((leagues) => (
          <option key={leagues.id} value={leagues.id}>
            {leagues.name}
          </option>
        ))}
      </select>
    </div>
    </>
  );
};

export default TeamManager;
