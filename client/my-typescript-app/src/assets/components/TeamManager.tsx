import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getFromLocalStorage } from '../../../storageUtil';
import { RootState, AppDispatch } from '../store';
import { addOrUpdateTeam, seeTeam, TeamData } from '../slices/teamSlice';
import { Player } from '../slices/footballSlice';
import playersData from '../../data/data_players.json';

const extractPlayers = (data: typeof playersData): Player[] => {
  return data.leagues.flatMap(league => 
    league.teams.flatMap(team => 
      team.players.map(player => ({
        ...player,
        leagueId: league.id,
        teamId: team.id
      }))
    )
  );
};

const TeamManager: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [matchDay, setMatchDay] = useState<number>(1);
  const [maxMatchdays, setMaxMatchdays] = useState<number>(38);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [leagueId, setLeagueId] = useState<string>('');
  const [showPlayers, setShowPlayers] = useState<boolean>(false);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [leaguePlayers, setLeaguePlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const userId = Number(getFromLocalStorage('userId')); 
  const dispatch = useDispatch<AppDispatch>();

  const { teams } = useSelector((state: RootState) => state.team);
  const { players, loading, error } = useSelector((state: RootState) => state.football);

  
  useEffect(() => {
    fetchLeagues();
    dispatch(seeTeam(userId));
    const extractedPlayers = extractPlayers(playersData);
    setAllPlayers(extractedPlayers);  
  }, [userId, dispatch]);

    const fetchLeagues = async () => {
      if (userId) {
        try {
          const url = `http://localhost:3000/api/leagues/show?userId=${userId}`;
          console.log('Fetching leagues with URL:', url);
          const response = await axios.get(url);
          console.log('Received leagues data:', response.data);
          if (Array.isArray(response.data) && response.data.length > 0) {
            setLeagues(response.data.map(league => ({
              ...league,
              num_matchdays: league.num_matchdays || 38 // Assurez-vous que num_matchdays est toujours défini
            })));
            setLeagueId(response.data[0].id.toString());
          } else {
            console.log('No leagues found or invalid data format');
            setLeagues([]);
            setLeagueId('');
          }
        } catch (error) {
          console.error('Error fetching leagues:', error);
          setLeagues([]);
          setLeagueId('');
        }
      }
    };

  const handleLeagueSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLeagueId(event.target.value);
  };

  // const handleCreateTeam = async () => {
  //   if (!leagueId) {
  //     setMessage('Please select a league.');
  //     return;
  //   }
  //   try {
  //     const selectedLeague = leagues.find(league => league.id.toString() === leagueId);
  //     if (!selectedLeague) {
  //       setMessage('Invalid league selected.');
  //       return;
  //     }
  //     const teamData = {
  //       name,
  //       league_id: leagueId,
  //       user_id: userId,
  //       championship_id: selectedLeague.championship_id,
  //       match_day: 1,
  //       gk: 0,
  //       def: 0,
  //       mid: 0,
  //       forward1: 0,
  //       forward2: 0
  //     };
  //     const resultAction = await dispatch(createTeam(teamData));
  //     if (createTeam.fulfilled.match(resultAction)) {
  //       setMessage(`Team ${name} created successfully!`);
  //       dispatch(seeTeam(userId)); // Refresh the teams list
  //     } else {
  //       setMessage('Error during the team creation.');
  //     }
  //   } catch (error) {
  //     console.error('Error during the team creation:', error);
  //     setMessage('Error during the team creation.');
  //   }
  // };
  
  const handleTeamAction = async () => {

    if (!leagueId) {
      setMessage('Please select a league');
      return;
    }
  
    if (!name) {
      setMessage('Please enter a team name');
      return;
    }
  
    const teamData= {
      name: name, 
      championship_id: leagues.find(league => league.id.toString() === leagueId).championship_id,
      league_id: leagueId,
      match_day: matchDay,
      gk: selectedTeam?.gk || 0,
      def: selectedTeam?.def || 0,
      mid: selectedTeam?.mid || 0,
      forward1: selectedTeam?.forward1 || 0,
      forward2: selectedTeam?.forward2 || 0,
      user_id: userId
    };
  
    try {
      const resultAction = await dispatch(addOrUpdateTeam(teamData));
      
      if (addOrUpdateTeam.fulfilled.match(resultAction)) {
        setSelectedTeam(resultAction.payload);
        setMessage(`Team ${resultAction.payload.id ? 'updated' : 'created'} for matchday ${matchDay}`);
        // Refresh the teams list
        dispatch(seeTeam(userId));
      } else {
        throw new Error(resultAction.error.message || 'Failed to add or update team');
      }
    } catch (error) {
      console.error('Error handling team action:', error);
      setMessage(`Error ${selectedTeam ? 'updating' : 'creating'} team for matchday.`);
    }
  };

  // const handleTeamSelect = async (teamId: string) => {
  //   try {
  //     const response = await axios.get(`http://localhost:3000/api/teams/${teamId}`);
  //     console.log('res:', response);
  //     setSelectedTeam(response.data);
  //     setMatchDay(response.data.match_day)
  //     const leagueResponse = await axios.get(`http://localhost:3000/api/leagues/${response.data.league_id}`);
  //     console.log('league res:', leagueResponse);
      
  //     setMaxMatchdays(leagueResponse.data.num_matchdays);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error fetching team details:', error);
  //     setMessage('Error fetching team details.');
  //   }
  // };

  const handleTeamSelect = async (teamId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/teams/${teamId}`);
      setSelectedTeam(response.data);
      setMatchDay(response.data.match_day);
  
      // Trouver la ligue correspondante dans le state local
      const selectedLeague = leagues.find(league => league.id === response.data.league_id);
      
      if (selectedLeague) {
        setMaxMatchdays(selectedLeague.num_matchdays || 38); // Utilisez une valeur par défaut si num_matchdays n'est pas défini
      } else {
        console.warn(`League with id ${response.data.league_id} not found in local state`);
        setMaxMatchdays(38); // Valeur par défaut
      }
  
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
      setMessage('Error fetching team details.');
    }
  };

  const handleMatchdayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMatchDay(Number(event.target.value));
  };

  const getPlayersByPosition = (positionCode: string) => {
    if (!selectedTeam) return []
    const championshipId = selectedTeam.championship_id.toString();
    return allPlayers.filter(player => {
      const idSuffix = player.id.toString().slice(-2);
      const idPrefix = player.id.toString().slice(0, 1);
      const isCorrectPosition = (positionCode === '01' && idSuffix === '01' && idPrefix===championshipId) ||
        (positionCode === '02' && ['02', '03', '08', '09'].includes(idSuffix) && idPrefix===championshipId) ||
        (positionCode === '04' && ['04', '05', '10', '11'].includes(idSuffix) && idPrefix===championshipId) ||
        (positionCode === '06' && ['06', '07', '12', '13', '14'].includes(idSuffix) && idPrefix===championshipId);
      return isCorrectPosition

    });
  };

  const isPlayerSelected = (playerId: number, positionCode: string) => {
  if (!selectedTeam) return false;
  switch (positionCode) {
    case '01': return selectedTeam.gk === playerId;
    case '02': return selectedTeam.def === playerId;
    case '04': return selectedTeam.mid === playerId;
    case '06': return selectedTeam.forward1 === playerId || selectedTeam.forward2 === playerId;
    default: return false;
  }
};

const renderPlayersByPosition = (positionCode: string, positionName: string) => {
  const positionPlayers = getPlayersByPosition(positionCode);
  return (
    <div>
      <h4>{positionName}</h4>
      <ul>
        {positionPlayers.map(player => {
          const isPlayerInTeam = isPlayerSelected(player.id, positionCode);
          return (
            <li key={player.id}>
              {player.name} 
              <button onClick={() => handlePlayerClick(player.id)}>Show stats</button>
              <button onClick={() => isPlayerInTeam ? handleRemoveFromTeam(positionCode) : handleAddToTeam(player.id, positionCode)}>
                {isPlayerInTeam ? 'Remove from team' : 'Add to team'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

  const handleAddToTeam = async (playerId: number, positionCode: string) => {
    
    if (!selectedTeam){
          setMessage('No team selected.');
    return}

    let updatedTeam = { 
      ...selectedTeam,
      user_id: userId, // Assurez-vous que userId est défini
      league_id: leagueId, // Assurez-vous que leagueId est défini
      match_day: matchDay // Assurez-vous que matchDay est défini
    };
     switch (positionCode) {
      case '01':
      case 'go' :
        updatedTeam.gk = playerId;
        break;
      case '02':
      case 'de' :
        updatedTeam.def = playerId;
        break;
      case '04':
      case 'mi' :
        updatedTeam.mid = playerId;
        break;
      case '06':
      case 'fo' :
        if (!updatedTeam.forward1) {
          updatedTeam.forward1 = playerId;
        } else {
          updatedTeam.forward2 = playerId;
        }
        break;
    }

    try {
      console.log('Adding player to team with data:', updatedTeam);
      const resultAction = await dispatch(addOrUpdateTeam(updatedTeam));
      if (addOrUpdateTeam.fulfilled.match(resultAction)) {
        setSelectedTeam(resultAction.payload);
        setMessage(`Player added to the team successfully!`);
      } else if (addOrUpdateTeam.rejected.match(resultAction)) {
        throw new Error(resultAction.error.message || 'Failed to add player to team');
      }
    } catch (error) {
      console.error('Error adding player to team:', error);
      setMessage('Error adding player to the team.');
    }
  };

  const handleRemoveFromTeam = async (positionCode: string) => {
    if (!selectedTeam) {
      setMessage('No team selected.');
      return;
    }
  
    let updatedTeam = { ...selectedTeam };
    switch (positionCode) {
      case '01':
        updatedTeam.gk = 0;
        break;
      case '02':
        updatedTeam.def = 0;
        break;
      case '04':
        updatedTeam.mid = 0;
        break;
      case '06':
        if (updatedTeam.forward2 !== 0) {
          updatedTeam.forward2 = 0;
        } else {
          updatedTeam.forward1 = 0;
        }
        break;
    }
  
    try {
      console.log('Removing player from team with data:', updatedTeam);
      const resultAction = await dispatch(addOrUpdateTeam(updatedTeam));
      if (addOrUpdateTeam.fulfilled.match(resultAction)) {
        setSelectedTeam(resultAction.payload);
        setMessage(`Player removed from the team successfully!`);
      } else if (addOrUpdateTeam.rejected.match(resultAction)) {
        throw new Error(resultAction.error.message || 'Failed to remove player from team');
      }
    } catch (error) {
      console.error('Error removing player from team:', error);
      setMessage('Error removing player from the team.');
    }
  };
  
  const handleUpdateTeam = async () => {
    if (!selectedTeam) return;
  
    const updatedTeam = {
      ...selectedTeam,
      match_day: matchDay
    };
  
    try {
      const resultAction = await dispatch(addOrUpdateTeam(updatedTeam));
      if (addOrUpdateTeam.fulfilled.match(resultAction)) {
        setSelectedTeam(resultAction.payload);
        setMessage(`Team updated for matchday ${matchDay}`);
      } else {
        throw new Error('Failed to update team');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      setMessage('Error updating team for matchday.');
    }
  };
  const handlePlayerClick = (playerId: number) => {
    setSelectedPlayerId(playerId);
  };

  interface PlayerStatsProps {
    player: Player;
  }
  
  const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
    const stats = player.previous_season_stats;
    const isGoalkeeper = player.position === 'Goalkeeper';
    
    if (!stats) {
      return <p>No stats available for this player.</p>;
    }
    
    return (
      <div>
        <h4>{player.name}'s Last Season Stats</h4>
        <p>Appearances: {stats.appearances}</p>
        {isGoalkeeper ? (
          <>
            <p>Clean Sheets: {stats.clean_sheets}</p>
            <p>Saves: {stats.saves}</p>
            <p>Goals Conceded: {stats.goals_conceded}</p>
          </>
        ) : (
          <>
            <p>Goals: {stats.goals}</p>
            <p>Assists: {stats.assists}</p>
            <p>Duels Won %: {stats.duels_won_percentage}</p>
            <p>Shots on Target: {stats.shots_on_target}</p>
            <p>Shots off Target: {stats.shots_off_target}</p>
            <p>Chances Created: {stats.chances_created}</p>
            <p>Yellow Cards: {stats.yellow_cards}</p>
            <p>Red Cards: {stats.red_cards}</p>
          </>
        )}
      </div>
    );
  };

  const selectedPlayerData = players.find(player => player.id === selectedPlayerId);
  const selectedPlayerStats = selectedPlayerData?.previous_season_stats;
  const isGoalkeeper = selectedPlayerData?.position === 'Goalkeeper';
  const filteredPlayers = searchTerm.trim() !== '' ? allPlayers.filter(player =>{
    const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const championshipMatch = selectedTeam ? player.id.toString().slice(0, 1) === selectedTeam.championship_id.toString() : true;
    return nameMatch && championshipMatch;
  }): [];


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
      <select value={leagueId} onChange={handleLeagueSelect}>
        <option value="">Select a league</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>
      <button onClick={handleTeamAction}>Create the team</button>
      {message && <p>{message}</p>}
    </div>
    <div>
    <h2>My Teams</h2>
        {teams.length > 0 ? (
          <select onChange={(e) => handleTeamSelect(e.target.value)}>
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
      {selectedTeam && (
      <div>
        <h3>Select match day</h3>
        <select value={matchDay} onChange={handleMatchdayChange}>
          {[...Array(20)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Matchday {i + 1}
            </option>
          ))}
        </select>
        <button onClick={handleUpdateTeam}>Update Team for Matchday</button>
        <h4>My Team for Matchday {matchDay}</h4>      
          
        <h4>My Team</h4>
        <p>
          Goalkeeper: {allPlayers.find(p => p.id === selectedTeam.gk)?.name || 'Not selected'}
          {selectedTeam.gk !==0 && (
          <button onClick={() => handleRemoveFromTeam('01')}>Remove</button>)}
        </p>
        <p>
          Defender: {allPlayers.find(p => p.id === selectedTeam.def)?.name || 'Not selected'}
          {selectedTeam.def !==0 && (
          <button onClick={() => handleRemoveFromTeam('02')}>Remove</button>)}
        </p>
        <p>
          Midfielder: {allPlayers.find(p => p.id === selectedTeam.mid)?.name || 'Not selected'}
          {selectedTeam.mid !==0 && (
          <button onClick={() => handleRemoveFromTeam('04')}>Remove</button>)}
        </p>
        <p>
          Forward 1: {allPlayers.find(p => p.id === selectedTeam.forward1)?.name || 'Not selected'}
          {selectedTeam.forward1 !==0 && (
          <button onClick={() => handleRemoveFromTeam('06')}>Remove</button>)}
        </p>
        <p>
          Forward 2: {allPlayers.find(p => p.id === selectedTeam.forward2)?.name || 'Not selected'}
          {selectedTeam.forward2 !==0 && (
          <button onClick={() => handleRemoveFromTeam('06')}>Remove</button>)}
        </p>

        <button onClick={() => setShowPlayers(!showPlayers)}>
          {showPlayers ? 'Hide Players' : 'Show Players'}
        </button>
        


        {showPlayers && (
          <>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search a player or a team"
            />
            
            <ul>
            {filteredPlayers.map((player) => (
              <li key={player.id}> 
                {player.name}
                <button onClick={() => handlePlayerClick(player.id)}>Show last season stats</button>
                <button onClick={() => handleAddToTeam(player.id, player.position.slice(0, 2).toLowerCase())}>Add to team</button>
              </li>
            ))}
            </ul>
            {renderPlayersByPosition('01', 'Goalkeepers')}
            {renderPlayersByPosition('02', 'Defenders')}
            {renderPlayersByPosition('04', 'Midfielders')}
            {renderPlayersByPosition('06', 'Forwards')}
          </>
        )}
      </div>
    )}

    {selectedPlayerId && (
      <PlayerStats player={allPlayers.find(player => player.id === selectedPlayerId)!} />
    )}
  </>
);
};

export default TeamManager;