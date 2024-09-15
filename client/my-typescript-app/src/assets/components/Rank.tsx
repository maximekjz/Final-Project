// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchLeagueStandings, fetchLeagueDetails } from '../slices/leagueSlice';
// import { RootState, AppDispatch } from '../store';
// import { useParams } from 'react-router-dom';

// const LeagueStandings: React.FC = () => {
//   console.log("LeagueStandings component rendered");
//   const dispatch = useDispatch<AppDispatch>();
//   const [selectedMatchDay, setSelectedMatchDay] = useState<number | undefined>(undefined);
//   const [error, setError] = useState<string | null>(null);
//   const { leagueId } = useParams<{ leagueId: string }>();
//   console.log("LeagueId from params:", leagueId);

//   const standings = useSelector((state: RootState) => state.league.standings);
//   console.log("Standings from state:", standings);

//   const league = useSelector((state: RootState) => 
//     state.league.leagues.find(l => l.id.toString() === leagueId)
//   );
//   console.log("League from state:", league);

//   const loading = useSelector((state: RootState) => state.league.loading);

//   const [currentLeagueId, setCurrentLeagueId] = useState<string | undefined>(leagueId);

//   useEffect(() => {
//     if (leagueId && leagueId !== currentLeagueId) {
//       setCurrentLeagueId(leagueId);
//     }
//   }, [leagueId]);
  
//   useEffect(() => {
//     if (leagueId) {
//       try {
//         dispatch(fetchLeagueStandings({ leagueId }));
//         dispatch(fetchLeagueDetails(leagueId));
//       } catch (error) {
//         console.error("Error fetching league data:", error);
//       }
//     }
//   }, [dispatch, leagueId]);

//   console.log("Component state - loading:", loading, "error:", error);

//   if (!leagueId) {
//     return <div>No league ID provided</div>;
//   }
  
//   if (loading) {
//     return <div>Loading standings data...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!leagueId) {
//     return <div>League ID is missing</div>;
//   }

//   if (!league) {
//     return <div>League not found</div>;
//   }

//   if (standings.length === 0) {
//     return <div>No standings data available</div>;
//   }

//   console.log("Rendering standings table");
//   return (
//     <div>
//       <h2>League Standings</h2>
//       <select onChange={(e) => {
//         const value = Number(e.target.value) || undefined;
//         console.log("Selected match day:", value);
//         setSelectedMatchDay(value);
//       }}>
//         <option value="">Overall</option>
//         {Array.from({ length: league.numMatchdays }, (_, i) => (
//           <option key={i + 1} value={i + 1}>Matchday {i + 1}</option>
//         ))}
//       </select>
//       <table>
//         <thead>
//           <tr>
//             <th>Rank</th>
//             <th>Team</th>
//             <th>Points</th>
//             <th>{selectedMatchDay ? 'Score' : 'Total Score'}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {standings.map((team) => (
//             <tr key={team.id}>
//               <td>{team.rank}</td>
//               <td>{team.team_name}</td>
//               <td>{team.points}</td>
//               <td>{selectedMatchDay ? team.score.toFixed(2) : team.total_score.toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LeagueStandings;
