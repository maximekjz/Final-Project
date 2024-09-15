import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { leagues as predefinedLeagues } from '../constants/leagues';
import { getFromLocalStorage } from '../../../storageUtil';
import { RootState, AppDispatch } from '../store';
import { seeLeague, fetchLeagueRanking, fetchLeagueDetails, updateRankings } from '../slices/leagueSlice';
import { Player } from '../slices/footballSlice';
import { TeamData } from '../slices/teamSlice';

const LeagueManager: React.FC = () => {
  const [name, setName] = useState('');
  const [championship, setChampionship] = useState<number | ''>('');
  const [createChampionship, setCreateChampionship] = useState<number | ''>('');
  const [viewChampionship, setViewChampionship] = useState<number | ''>('');
  const [maxTeams, setMaxTeams] = useState(10);
  const [numMatchdays, setNumMatchdays] = useState(20);
  const [message, setMessage] = useState<string | null>(null);
  const [messageJoin, setMessageJoin] = useState<string | null>(null);
  const [leagueCode, setLeagueCode] = useState<string>('');
  const [currentMatchDay, setCurrentMatchDay] = useState(1);
  const [myLeagues, setMyLeagues] = useState<any[]>([]); 
  const [allLeagues, setAllLeagues] = useState<any[]>([]);
  const [filteredLeagues, setFilteredLeagues] = useState<any[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [selectedMatchDay, setSelectedMatchDay] = useState<number | undefined>(undefined);
  const userId = Number(getFromLocalStorage('userId')); 
  const dispatch = useDispatch<AppDispatch>();
  const leagueDetails = useSelector((state: RootState) => state.league.currentLeague);
  const { leagues, ranking, loading, error } = useSelector((state: RootState) => state.league);
  const allPlayers = useSelector((state: RootState) => state.football.players);
  const { teams } = useSelector((state: RootState) => state.team);

  function calculatePlayerScore(player: Player, matchDay: number): number {
    let score = 3; // Score de base
  
    const stats = player.current_season_stats?.[`match_${matchDay}`];
    if (!stats) return score;
  
    switch (player.position) {
      case 'Goalkeeper':
        score += stats.saves * 0.1;
        score -= stats.goals_conceded;
        break;
      case 'Defender':
        if (stats.duels_won_percentage >= 50) score += 1;
        // Supposons que nous avons une statistique pour les fautes
        const fouls = stats.fouls || 0;
        if (fouls === 0) score += 1;
        else score -= fouls * 0.3;
        break;
      case 'Midfielder':
        if (stats.duels_won_percentage >= 50) score += 1;
        // Supposons que nous avons une statistique pour les dribbles réussis
        if (stats.successful_dribbles_percentage >= 50) score += 1;
        score += stats.chances_created * 0.3;
        break;
      case 'Forward':
        score += stats.goals * 0.8;
        score += stats.shots_on_target * 0.2;
        score -= stats.shots_off_target * 0.3;
        break;
    }
  
    score -= (stats.yellow_cards || 0) * 1;
    score -= (stats.red_cards || 0) * 3;
  
    return Math.max(score, 0); 
  }

  function calculateTeamScore(team: TeamData, matchDay: number): number {
    return [team.gk, team.def, team.mid, team.forward1, team.forward2]
      .map(playerId => {
        const player = allPlayers.find(p => p.id === Number(playerId));
        return player ? calculatePlayerScore(player, matchDay) : 0;
      })
      .reduce((sum, score) => sum + score, 0);
  }
  
  
  useEffect(() => {
      fetchLeagues();
  }, [userId]);

  useEffect(() => {
    filterLeagues();
  }, [viewChampionship, allLeagues]);

  useEffect(() => {
    if (selectedLeagueId) {
      dispatch(fetchLeagueDetails(selectedLeagueId));
    }
  }, [selectedLeagueId, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(seeLeague(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (selectedLeagueId) {
      dispatch(fetchLeagueRanking({ leagueId: selectedLeagueId, matchDay: selectedMatchDay }));
      dispatch(fetchLeagueDetails(selectedLeagueId));
    }
  }, [dispatch, selectedLeagueId, selectedMatchDay]);

  useEffect(() => {
    if (leagues.length > 0) {
      if (viewChampionship === '') {
        setFilteredLeagues(leagues);
      } else {
        const filtered = leagues.filter(league => 
          league.championship_id === Number(viewChampionship)
        );
        setFilteredLeagues(filtered);
      }
    }
  }, [viewChampionship, leagues]);
  
  const fetchLeagues = async () => {
    if (userId) {
      try {
        const url = `http://localhost:3000/api/leagues/show?userId=${userId}`;
        console.log('Fetching leagues with URL:', url);
        const response = await axios.get(url);
        console.log('Received leagues data:', response.data);
        setAllLeagues(response.data);
      } catch (error) {
        console.error('Error fetching leagues:', error);
        // ... gestion des erreurs ...
      }
    }
  };

  const filterLeagues = () => {
    console.log('Filtering leagues. viewChampionship:', viewChampionship);
    console.log('All leagues:', allLeagues);

    if (viewChampionship === '') {
      console.log('Showing all leagues');
      setFilteredLeagues(allLeagues);
    } else {
      console.log('Filtering for championship:', viewChampionship);
      const filtered = allLeagues.filter(league => 
        String(league.championship_id) === String(viewChampionship)
      );
      console.log('Filtered leagues:', filtered);
      setFilteredLeagues(filtered);
    }
  };


  const handleCreateLeague = async () => {
    if (createChampionship === '') {
      setMessage('Please select a championship.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/leagues/create', {
        name,
        championship_id: createChampionship,
        max_teams: maxTeams,
        created_by: userId,
        num_matchdays: numMatchdays,
      });

      const { leagueId, leagueCode } = response.data;
      
      setMessage(`League created and joined successfully! League code: ${leagueCode}`);

    } catch (error) {
      console.error('Error during the league creation:', error);
      if (axios.isAxiosError(error) && error.response) {
        setMessage(`Error: ${error.response.data.message || 'Unknown error occurred'}`);
      } else {
        setMessage('Error during the league creation.');
      }
    }
  };

  const handleJoinLeague = async () => {
    if (leagueCode === '') {
      setMessageJoin('Please enter the league code.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/leagues/join', {
        league_code: leagueCode,
        user_id: userId,
      });
      setMessageJoin(`League joined successfully! League code: ${leagueCode}`);

      // Refresh the leagues list after joining

      const action = await dispatch(seeLeague(userId));
      if (action.payload && Array.isArray(action.payload)) {
        setMyLeagues(action.payload);
      }
    } catch (error) {
      console.error('Error joining league:', error);
      if (axios.isAxiosError(error) && error.response) {
        setMessageJoin(`Error: ${error.response.data.message || 'Unknown error occurred'}`);
      } else {
        setMessageJoin('Error joining the league.');
      }
    }
  };

  const handleChampionshipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log('Championship selected:', value);
    setViewChampionship(value === '' ? '' : Number(value));
  };

  const handleLeagueSelect = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    setSelectedMatchDay(undefined); 
  };


  const handleUpdateRankings = async () => {
    if (selectedLeagueId) {
      try {
        const leagueTeams = teams.filter(team => team.league_id === selectedLeagueId);

        const scores = leagueTeams.map(team => ({
          team_id: team.id!,
          match_day: currentMatchDay,
          score: calculateTeamScore(team, currentMatchDay)
        }));

        await dispatch(updateRankings({ leagueId: selectedLeagueId, scores }));
        dispatch(fetchLeagueRanking({ leagueId: selectedLeagueId }));
      } catch (error) {
        console.error('Failed to update rankings:', error);
      }
    }
  };

  const renderRanking = () => {
    if (!selectedLeagueId) return null;
    const selectedLeague = leagues.find(l => l.id.toString() === selectedLeagueId);
    if (!selectedLeague) return null;


    return (
      <div>
        <h3>Ranking for {selectedLeague.name}</h3>
        <select onChange={(e) => setSelectedMatchDay(Number(e.target.value) || undefined)}>
          <option value="">Overall</option>
          {Array.from({ length: selectedLeague.numMatchdays }, (_, i) => (   // ici
            <option key={i + 1} value={i + 1}>Matchday {i + 1}</option>
          ))}
        </select>
        {ranking.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Points</th>
                <th>{selectedMatchDay ? 'Score' : 'Total Score'}</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((team) => (
                <tr key={team.id}>
                  <td>{team.rank}</td>
                  <td>{team.team_name}</td>
                  <td>{team.points}</td>
                  <td>{selectedMatchDay ? team.score.toFixed(2) : team.total_score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No ranking data available</p>
        )}
      </div>
    );
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
        <select value={createChampionship} onChange={(e) => setCreateChampionship(Number(e.target.value))}>
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
      <h2>Join a league</h2>
      <input
        type="text"
        placeholder="League code"
        value={leagueCode}
        onChange={(e) => setLeagueCode(e.target.value)}
      />
      <button onClick={handleJoinLeague}>Join the league</button>
      {messageJoin && <p>{messageJoin}</p>}
      <div>
        <h2>My Leagues</h2>
        <select value={viewChampionship} onChange={handleChampionshipChange}>
          <option value="">All Championships</option>
          {predefinedLeagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
        {filteredLeagues.length > 0 ? (
          <ul>
          {filteredLeagues.map((league) => (
            <li key={league.id}>
              {league.name}
              <button onClick={() => handleLeagueSelect(league.id.toString())}>View ranking</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No leagues found for this championship</p>
      )}
        <select value={currentMatchDay} onChange={(e) => setCurrentMatchDay(Number(e.target.value))}>
          {Array.from({ length: 20 }, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>Match Day {day}</option>
          ))}
        </select>
      <button onClick={handleUpdateRankings} disabled={!selectedLeagueId}>
        Update Rankings for Match Day {currentMatchDay}
      </button>
      {renderRanking()}
    </div>
  </>
);
};

export default LeagueManager;