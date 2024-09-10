// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { Player } from './footballSlice';

// interface TeamState {
//     details: {
//         id: number;
//         players: Player[];
//     } | null;
//     status: 'idle' | 'loading' | 'failed';
// }

// const initialState: TeamState = {
//     details: null,
//     status: 'idle',
// };

// // Thunk pour récupérer les détails de l'équipe
// export const fetchTeamDetails = createAsyncThunk(
//     'team/fetchTeamDetails',
//     async (teamId: number) => {
//         const response = await axios.get(`/api/teams/${teamId}`);
//         return response.data;
//     }
// );

// const teamSlice = createSlice({
//     name: 'team',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchTeamDetails.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchTeamDetails.fulfilled, (state, action) => {
//                 state.status = 'idle';
//                 state.details = action.payload;
//             })
//             .addCase(fetchTeamDetails.rejected, (state) => {
//                 state.status = 'failed';
//             });
//     },
// });

// export default teamSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Définition des types pour les données de ligue
interface Team {
  id: number;
  name: string;
  league_id: number;
  matchDay: number
}

// Définition des types pour l'état du slice
interface TeamState {
  teams: Team[];          // Liste des ligues
  teamCode: string | null;  // Code de la ligue créée ou jointe
  loading: boolean;           // État de chargement
  error: string | null;       // Message d'erreur
}

// État initial du slice
const initialState: TeamState = {
  teams: [],
  teamCode: null,
  loading: false,
  error: null,
};

// Action asynchrone pour créer une nouvelle ligue
export const createTeam = createAsyncThunk(
  'team/createTeam',
  async (teamData: { name: string; league_id: number;  userId: number; matchDay: number  }) => {
    const response = await axios.post('/api/teams', teamData);
    return response.data;  // Retour des données de la ligue créée
  }
);

// Action asynchrone pour rejoindre une ligue existante
export const joinLeague = createAsyncThunk(
  'league/joinLeague',
  async (data: { leagueCode: string; userId: number }) => {
    const response = await axios.post('/api/leagues/join', data);
    return response.data;  // Retour des données de la ligue rejointe
  }
);

// Création du slice avec les reducers et les actions
const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create league';
      })
      .addCase(joinLeague.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinLeague.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
      })
      .addCase(joinLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to join league';
      });
  },
});

export default leagueSlice.reducer;

