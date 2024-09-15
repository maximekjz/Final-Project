// import { Player, Team } from "./footballSlice";
// import playersData from '../../data/data_players.json';
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from '../store'; 

// type PlayerData = typeof playersData['leagues'][0]['teams'][0]['players'][0];

// const extractPlayers = (data: typeof playersData): Player[] => {
//     return data.leagues.flatMap(league => 
//       league.teams.flatMap(team => 
//         team.players.map(player => ({
//           ...player,
//           leagueId: league.id,
//           teamId: team.id
//         }))
//       )
//     );
//   };

// const allPlayers = extractPlayers(playersData);


// function calculatePlayerScore(player: Player, matchDay: number): number {
//     let score = 3; // Starting score for all players
  
//     const stats = player.current_season_stats?.[`match_${matchDay}`];
//     if (!stats) return score;
  
//     switch (player.position) {
//       case 'Goalkeeper':
//         score += stats.saves * 0.1;
//         score -= stats.goals_conceded;
//         break;
//       case 'Defender':
//         if (stats.duels_won_percentage >= 50) score += 1;
//         if (stats.fouls_committed === 0) score += 1;
//         else score -= stats.fouls_committed * 0.3;
//         break;
//       case 'Midfielder':
//         if (stats.duels_won_percentage >= 50) score += 1;
//         if (stats.successful_dribbles_percentage >= 50) score += 1;
//         score += stats.chances_created * 0.3;
//         break;
//       case 'Forward':
//         score += stats.goals * 0.8;
//         score += stats.shots_on_target * 0.2;
//         score -= stats.shots_off_target * 0.3;
//         break;
//     }
  
//     score -= stats.yellow_cards;
//     score -= stats.red_cards * 3;
  
//     return Math.max(0, score); 
//   }

//   function calculateTeamScore(team: Team, matchDay: number): number {
//     return [team.gk, team.def, team.mid, team.forward1, team.forward2]
//       .map(playerId => {
//         if (typeof playerId === 'number') {
//           const player = allPlayers.find(p => p.id === playerId);
//           return player ? calculatePlayerScore(player, matchDay) : 0;
//         }
//         return 0;
//       })
//       .reduce((total, score) => total + score, 0);
//   }
  
//   export const calculateAndSaveTeamScores = createAsyncThunk(
//     'rank/calculateAndSaveTeamScores',
//     async ({ leagueId, matchDay }: { leagueId: string, matchDay: number }, { getState }) => {
//       const state = getState() as RootState;
//       const teamsInLeague = state.team.teams as Team[];
  
//       const scores = teamsInLeague.map(team => ({
//         team_id: team.id,
//         match_day: matchDay,
//         score: calculateTeamScore(team, matchDay),
//       }));
  
//       const response = await axios.post('/api/team-scores', { leagueId, scores });
//       return response.data;
//     }
//   );
  
//   const rankSlice = createSlice({
//     name: 'rank',
//     initialState: {},
//     reducers: {},
//     extraReducers: (builder) => {
//     }
//   });
  
//   export default rankSlice.reducer;
