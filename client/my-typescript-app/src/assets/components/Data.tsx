import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AppDispatch, RootState } from '../store';
import { fetchCompetitions, fetchTeams, fetchPlayers } from '../actions/footballActions';
import { setSelectedLeagueId } from '../slices/footballSlice';
import { leagues } from '../constants/leagues';
import { Player } from '../../data/playersData';

const Data: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { teams, players, selectedLeagueId, loading, error } = useSelector((state: RootState) => state.football);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [likedPlayers, setLikedPlayers] = useState<number[]>([]);


  useEffect(() => {
    dispatch(fetchCompetitions());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLeagueId !== null) {
      dispatch(fetchTeams(selectedLeagueId));
      setSelectedTeamId(null);
    }
  }, [dispatch, selectedLeagueId]);

  useEffect(() => {
    if (selectedTeamId !== null) {
      dispatch(fetchPlayers(selectedTeamId));
    }
  }, [dispatch, selectedTeamId]);

  const handleLeagueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = parseInt(event.target.value, 10);
    dispatch(setSelectedLeagueId(leagueId));
  };

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = parseInt(event.target.value, 10);
    setSelectedTeamId(teamId);
  };

  const handlePlayerClick = (playerName: string) => {
    setSelectedPlayer(playerName);
  };

  const toggleLike = async (player: Player) => {
    const identifier: string = `${player.name}-${player.position}-${player.teamName}`;

    if (likedPlayers.includes(identifier)) {
      // Logique pour enlever un "like"
      setLikedPlayers(likedPlayers.filter(like => like !== identifier));
      try {
        await axios.delete('http://localhost:3000/like', {
          data: {
            userId: Number(localStorage.getItem('id')), 
            championshipId: selectedLeagueId,
            playerName: player.name,
            position: player.position
          }
        });
      } catch (error) {
        console.error('Error removing like:', error);
      }
    } else {
      // Logique pour ajouter un "like"
      setLikedPlayers([...likedPlayers, identifier]);
      try {
        await axios.post('http://localhost:3000/like', {
          userId: Number(localStorage.getItem('id')), 
          championshipId: selectedLeagueId,
          playerName: player.name,
          position: player.position
        });
      } catch (error) {
        console.error('Error adding like:', error);
      }
    }
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

  const selectedPlayerData = players.find(player => player.name === selectedPlayer);
  const selectedPlayerStats = selectedPlayerData?.previous_season_stats;
  const isGoalkeeper = selectedPlayerData?.position === 'Goalkeeper';

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
      <select onChange={handleTeamChange} value={selectedTeamId || ''}>
        <option value="">Select a team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      <h2>Players</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search a player"
      />
      <ul>
        {filteredPlayers.map((player) => (
          <li key={player.name}>
            {player.name}
            <button onClick={() => handlePlayerClick(player.name)}>Show last season stats</button>
            <button
              onClick={() => toggleLike(player.name, player.position, player.team_name)}
              style={{ marginLeft: '10px', cursor: 'pointer' }}
            >
              {likedPlayers.includes(`${player.name}-${player.position}-${player.team_name}`) ? 'Unlike' : 'Like'}
            </button>
          </li>
        ))}
      </ul>

      {selectedPlayerStats && (
  <div>
    <h3>{selectedPlayer}'s last season's stats</h3>
    <p>Appearances: {selectedPlayerStats.appearances}</p>
    {isGoalkeeper ? (
      <>
        <p>Clean Sheets: {selectedPlayerStats.clean_sheets}</p>
        <p>Saves: {selectedPlayerStats.saves}</p>
        <p>Goals Conceded: {selectedPlayerStats.goals_conceded}</p>
      </>
    ) : null}
      <>
        <p>Goals: {selectedPlayerStats.goals}</p>
        <p>Assists: {selectedPlayerStats.assists}</p>
        <p>Duels Won %: {selectedPlayerStats.duels_won_percentage}</p>
        <p>Shots on Target: {selectedPlayerStats.shots_on_target}</p>
        <p>Shots off Target: {selectedPlayerStats.shots_off_target}</p>
        <p>Chances Created: {selectedPlayerStats.chances_created}</p>
        <p>Yellow Cards: {selectedPlayerStats.yellow_cards}</p>
        <p>Red Cards: {selectedPlayerStats.red_cards}</p>
      </>
  </div>
)}

    </div>
  );
};

export default Data;






/**                Code wwith API
 * 
 * import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchCompetitions, fetchTeams, fetchPlayers } from '../actions/footballActions';
import { setSelectedLeagueId } from '../slices/footballSlice';
import { leagues } from '../constants/leagues'; // Importer les ligues directement

const Data: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { teams, players, selectedLeagueId, loading, error } = useSelector((state: RootState) => state.football);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCompetitions());
  }, [dispatch]);

  useEffect(() => {
    if (selectedLeagueId !== null) {
      dispatch(fetchTeams(selectedLeagueId));
      console.log('Selected League ID:', selectedLeagueId);
         setSelectedTeamId(null);
    }
  }, [dispatch, selectedLeagueId]);

  useEffect(() => {
    if (selectedTeamId !== null && selectedLeagueId !== null) {
      dispatch(fetchPlayers({ teamId: selectedTeamId, seasonId: selectedLeagueId }));
    }
  }, [dispatch, selectedTeamId, selectedLeagueId]);

  const handleLeagueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = parseInt(event.target.value, 10);
    dispatch(setSelectedLeagueId(leagueId));
  };

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = parseInt(event.target.value, 10);
    setSelectedTeamId(teamId);
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
      <select onChange={handleTeamChange} value={selectedTeamId || ''}>
        <option value="">Select a team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

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
    </div>
  );
};

export default Data;
*/