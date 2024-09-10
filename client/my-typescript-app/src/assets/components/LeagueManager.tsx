import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { leagues as predefinedLeagues } from '../constants/leagues';
import { getFromLocalStorage, saveToLocalStorage } from '../../../storageUtil';
import { RootState, AppDispatch } from '../store';
// import { seeLeague } from '../slices/leagueSlice';

const LeagueManager: React.FC = () => {
  const [name, setName] = useState('');
  const [championship, setChampionship] = useState<number | ''>('');
  const [maxTeams, setMaxTeams] = useState(10);
  const [numMatchdays, setNumMatchdays] = useState(20);
  const [message, setMessage] = useState<string | null>(null);
  const [messageJoin, setMessageJoin] = useState<string | null>(null);
  const [leagueCode, setLeagueCode] = useState<string>('');
  const [myLeagues, setMyLeagues] = useState<any[]>([]); 
  const userId = Number(getFromLocalStorage('userId')); 
  const dispatch = useDispatch<AppDispatch>();


  // useEffect(() => {
  //   const fetchMyLeagues = async () => {
  //     try {
  //       const action = await dispatch(seeLeague({ userId }));
  //       console.log('Action payload:', action.payload); // Ajoutez ceci pour vérifier les données
  //       const result = action.payload as any[];
  
  //       if (Array.isArray(result)) {
  //         setMyLeagues(result);
  //       } else {
  //         console.error('Expected an array but got:', result);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching my leagues:', error);
  //     }
  //   };
  
  //   fetchMyLeagues();
  // }, [userId, dispatch]);

    
  const handleCreateLeague = async () => {
    if (championship === '') {
      setMessage('Please select a championship.');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/leagues/create', {
        name,
        championship_id: championship,
        max_teams: maxTeams,
        created_by: userId,
        num_matchdays: numMatchdays,
      });

      const { leagueId, leagueCode } = response.data;

      // setMessage(`League created successfully! League code: ${leagueCode}`);
      
      const res = await axios.post('http://localhost:3000/api/leagues/join', {
        user_id: userId,
        league_code: leagueCode,      
      });
      
      setMessage(`League created and joined successfully! League code: ${leagueCode}`);

    } catch (error) {
      console.error('Error during the league creation:', error);
      setMessage('Error during the league creation.');
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
      // const action = await dispatch(seeLeague({ userId }));
      // const result = action.payload as any[];
      // setMyLeagues(result);
        } catch (error) {
          console.error('Error fetching my leagues:', error);
        }
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
      <select value={championship} onChange={(e) => setChampionship(Number(e.target.value))}>
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
      <select value="" onChange={(e) => setChampionship(Number(e.target.value))}>
        <option value="">Select a championship</option>
        {myLeagues.length > 0 ? (
          myLeagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))
        ) : (
          <option value="">No leagues available</option>
        )}
      </select>
    </div>
    </>
  );
};

export default LeagueManager;
