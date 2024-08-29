import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchCompetitions, fetchCurrentSeason, fetchTeams, fetchPlayers } from '../actions/footballActions';
import { setSelectedLeagueId } from '../slices/footballSlice';
import { leagues } from '../constants/leagues'; 

const Data: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { competitions, currentSeason, teams, players, selectedLeagueId, loading, error } = useSelector((state: RootState) => state.football);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCompetitions());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLeagueId !== null) {
      dispatch(fetchCurrentSeason(selectedLeagueId));
    }
  }, [dispatch, selectedLeagueId]);

  useEffect(() => {
    if (currentSeason?.id) {
      dispatch(fetchTeams(currentSeason.id));
    }
  }, [dispatch, currentSeason]);

  useEffect(() => {
    if (teams.length > 0 && currentSeason?.id) {
      dispatch(fetchPlayers({ teamId: teams[0].id, seasonId: currentSeason.id }));
    }
  }, [dispatch, teams, currentSeason]);

  const handleLeagueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = parseInt(event.target.value, 10);
    dispatch(setSelectedLeagueId(leagueId));
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Select League</h2>
      <select onChange={handleLeagueChange} value={selectedLeagueId || ''}>
        <option value="">Select a league</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>

      <h2>Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>

      <h2>Players</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search a player"
      />
      <ul>
        {filteredPlayers.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Data;
