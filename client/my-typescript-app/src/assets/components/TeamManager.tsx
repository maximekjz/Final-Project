import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getFromLocalStorage } from '../../../storageUtil';
import { RootState, AppDispatch } from '../store';
import { createTeam, seeTeam } from '../slices/teamSlice';

const TeamManager: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [leagueId, setLeagueId] = useState<string>('');
  const [leagues, setLeagues] = useState<any[]>([]);
  const userId = Number(getFromLocalStorage('userId')); 
  const dispatch = useDispatch<AppDispatch>();

  const { teams } = useSelector((state: RootState) => state.team);

  
  useEffect(() => {
    fetchLeagues();
    dispatch(seeTeam(userId));
  }, [userId, dispatch]);

  const fetchLeagues = async () => {
    if (userId) {
      try {
        const url = `http://localhost:3000/api/teams/show/${userId}`;
        console.log('Fetching leagues with URL:', url);
        const response = await axios.get(url);
        console.log('Received leagues data:', response.data);
        setLeagues(response.data);
      } catch (error) {
        console.error('Error fetching leagues:', error);
        // ... gestion des erreurs ...
      }
    }
  };



  const handleCreateTeam = async () => {
    if (!leagueId) {
      setMessage('Please select a league.');
      return;
    }
    
    try {
      const selectedLeague = leagues.find(league => league.id.toString() === leagueId);
      if (!selectedLeague) {
        setMessage('Invalid league selected.');
        return;
      }
      const teamData = {
        name,
        league_id: leagueId,
        user_id: userId,
        championship_id: selectedLeague.championship_id,
        gk: 0,
        def: 0,
        mid: 0,
        forward1: 0,
        forward2: 0
      };
      const resultAction = await dispatch(createTeam(teamData));
      if (createTeam.fulfilled.match(resultAction)) {
        setMessage(`Team ${name} created successfully!`);
        dispatch(seeTeam(userId)); // Refresh the teams list
      } else {
        setMessage('Error during the team creation.');
      }
    } catch (error) {
      console.error('Error during the team creation:', error);
      setMessage('Error during the team creation.');
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
      <select value={leagueId} onChange={(e) => setLeagueId(e.target.value)}>
        <option value="">Select a league</option>
        {leagues.map((league) => (
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
      {teams.length > 0 ? (
        <select>
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      ) : (
        <p>No teams found</p>
      )}
    </div>
    </>
  );
};

export default TeamManager;