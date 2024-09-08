import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AppDispatch, RootState } from '../store';
import { fetchCompetitions, fetchTeams, fetchPlayers, addTeam, removeTeam, getTeams, addPlayerToTeam, removePlayerFromTeam } from '../actions/footballActions';
import { setSelectedLeagueId } from '../slices/footballSlice';
import { Player, Team } from '../slices/footballSlice';
import { leagues, teams as localTeams } from '../constants/leagues';

const Data: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { teams, players, selectedLeagueId, loading, error } = useSelector((state: RootState) => state.football);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [likedPlayers, setLikedPlayers] = useState<number[]>([]); // Changed to number[]
  const [localError, setLocalError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
          setLocalError(error.message);
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

  const handlePlayerClick = (playerId: number) => {
    setSelectedPlayerId(playerId);
  };

  const toggleLike = async (player: Player) => {
    const { id } = player;
  
    const user_id = Number(localStorage.getItem('id'));
  
    if (likedPlayers.includes(id)) {
      setLikedPlayers(likedPlayers.filter(like => like !== id));
      try {
        await axios.delete('http://localhost:3000/api/like/remove', {
          data: {
            user_id,
            championship_id: selectedLeagueId,
            player_id: id
          }
        });
        setLocalError('Error unliking player');
        console.log('Successfully removed like for player:', id);
      } catch (error) {
        console.error('Error removing like:', error);
      }
    } else {
      setLikedPlayers([...likedPlayers, id]);
      try {
        await axios.post('http://localhost:3000/api/like/add', {
          user_id,
          championship_id: selectedLeagueId,
          player_id: id
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Successfully added like for player:', id);
        setLocalError('Error liking player');

      } catch (error) {
        console.error('Error adding like:', error);
      }
    }
  };

  const addPlayer = async (playerId: number) => {
    if (selectedTeamId !== null) {
        try {
            await dispatch(addPlayerToTeam({ teamId: selectedTeamId, playerId })).unwrap();
        } catch (error) {
            setLocalError('Error adding player to team');
        }
    }
};

const removePlayer = async (playerId: number) => {
    if (selectedTeamId !== null) {
        try {
            await dispatch(removePlayerFromTeam({ teamId: selectedTeamId, playerId })).unwrap();
        } catch (error) {
            setLocalError('Error removing player from team');
        }
    }
};

  const filteredTeams = selectedLeagueId
  ? localTeams.filter(team => team.league === selectedLeagueId)
  : [];

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error || localError}</div>;
  }

  const selectedPlayerData = players.find(player => player.id === selectedPlayerId);
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
        {filteredTeams.map((team) => (
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
          <button onClick={() => addPlayer(player.id)}>Add to Team</button>
          <button onClick={() => removePlayer(player.id)} style={{ marginLeft: '10px' }}>Remove from Team</button>
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
