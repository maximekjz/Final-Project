import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AppDispatch, RootState } from '../store';
import { fetchCompetitions, fetchTeams, fetchPlayers } from '../actions/footballActions';
import { setSelectedLeagueId } from '../slices/footballSlice';
import { Player, Team } from '../slices/footballSlice'; // Importer les types ici
import { leagues } from '../constants/leagues';

const Data: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { teams, players, selectedLeagueId, loading, error } = useSelector((state: RootState) => state.football);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedplayerid, setSelectedplayerid] = useState<number | null>(null);
  const [likedPlayers, setLikedPlayers] = useState<(string | number)[]>([]); // Changed to number[]
  const [localError, setLocalError] = useState<string | null>(null); // Added local error state

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
      dispatch(fetchPlayers(selectedTeamId))
        .unwrap()
        .catch((error: any) => {
          console.error('Failed to fetch players:', error);
          setLocalError(error.message); // Set local error state
        });
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

  const handlePlayerClick = (playerid: number) => {
    setSelectedplayerid(playerid);
  };

  const toggleLike = async (player: Player) => {
    const identifier = `${player.name}-${player.position}-${player.teamName}`;
    console.log('Toggling like for:', identifier);
  
    const user_id = Number(localStorage.getItem('id'));
    console.log('User ID:', user_id);
    console.log('Selected League ID:', selectedLeagueId);
    console.log('Player ID:', player.id);
  
    if (likedPlayers.includes(identifier)) {
      // Logic to remove like
      setLikedPlayers(likedPlayers.filter(like => like !== identifier));
      try {
        await axios.delete('http://localhost:3000/like', {
          data: {
            user_id,
            championship_id: selectedLeagueId,
            player_name: player.name,
            position: player.position,
            playerid: player.id // Assurez-vous que player.id est un nombre
          }
        });
      } catch (error) {
        console.error('Error removing like:', error);
      }
    } else {
      // Logic to add like
      setLikedPlayers([...likedPlayers, identifier]);
      try {
        await axios.post('http://localhost:3000/like', {
          user_id,
          championship_id: selectedLeagueId,
          player_name: player.name,
          position: player.position,
          playerid: player.id
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
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

  const selectedPlayerData = players.find(player => player.id === selectedplayerid);
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
        <li key={player.id}> {/* Assurez-vous que player.id est unique */}
          {player.name}
          <button onClick={() => handlePlayerClick(player.id)}>Show last season stats</button>
          <button
            onClick={() => toggleLike(player)}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          >
            {likedPlayers.includes(player.id) ? 'Unlike' : 'Like'}
          </button>
        </li>
      ))}
      </ul>

      {localError && <div>Error: {localError}</div>} {/* Display local errors */}

      {selectedPlayerStats && (
        <div>
          <h3>{selectedPlayerData?.name}'s last season's stats</h3>
          <p>Appearances: {selectedPlayerStats.appearances}</p>
          {isGoalkeeper ? (
            <>
              <p>Clean Sheets: {selectedPlayerStats.clean_sheets}</p>
              <p>Saves: {selectedPlayerStats.saves}</p>
              <p>Goals Conceded: {selectedPlayerStats.goals_conceded}</p>
            </>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default Data;
