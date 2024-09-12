import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { leagues as predefinedLeagues } from '../constants/leagues';
import { getFromLocalStorage, saveToLocalStorage } from '../../../storageUtil';
import { RootState, AppDispatch } from '../store';
import { seeLeague } from '../slices/leagueSlice';

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
  const [myLeagues, setMyLeagues] = useState<any[]>([]); 
  const [allLeagues, setAllLeagues] = useState<any[]>([]);
  const [filteredLeagues, setFilteredLeagues] = useState<any[]>([]);
  const userId = Number(getFromLocalStorage('userId')); 
  const dispatch = useDispatch<AppDispatch>();
  const { leagues, loading, error } = useSelector((state: RootState) => state.league);


  useEffect(() => {
      fetchLeagues();
  }, [userId]);

  useEffect(() => {
    filterLeagues();
  }, [viewChampionship, allLeagues]);

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
          <select>
            <option value="">Select a league</option>
            {filteredLeagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name} (Championship: {league.championship_id})
              </option>
            ))}
          </select>
        ) : (
          <p>No leagues found for this championship</p>
        )}
      </div>
    </>
  );
};

export default LeagueManager;