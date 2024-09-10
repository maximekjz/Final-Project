import React, { useState } from 'react';
import axios from 'axios';

const TeamForm: React.FC = () => {
  const [name, setName] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/teams/create', {
        name,
        league_id: leagueId,
        user_id: userId
      });
      alert('Team created successfully');
      // Réinitialiser les champs ou rediriger l'utilisateur si nécessaire
    } catch (error) {
      console.error(error);
      alert('Error creating team');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Team</h2>
      <label>
        Team Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        League ID:
        <input type="text" value={leagueId} onChange={(e) => setLeagueId(e.target.value)} required />
      </label>
      <label>
        User ID:
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      </label>
      <button type="submit">Create Team</button>
    </form>
  );
};

export default TeamForm;

