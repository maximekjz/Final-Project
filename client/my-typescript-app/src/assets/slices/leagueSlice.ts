import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import fetch from 'node-fetch'

// Définition des types pour les données de ligue
interface League {
  id: number;
  name: string;
  championshipId: number;
  maxTeams: number;
  leagueCode: string;
  createdBy: number;
  numMatchdays: number;
}

// Définition des types pour l'état du slice
interface LeagueState {
  leagues: League[];          // Liste des ligues
  leagueCode: string | null;  // Code de la ligue créée ou jointe
  loading: boolean;           // État de chargement
  error: string | null;       // Message d'erreur
}

// État initial du slice
const initialState: LeagueState = {
  leagues: [],
  leagueCode: null,
  loading: false,
  error: null,
};

// Action asynchrone pour créer une nouvelle ligue
export const createLeague = createAsyncThunk(
  'league/createLeague',
  async (leagueData: { name: string; championship: string; maxTeams: number; userId: number; numMatchdays: number }) => {
    const response = await axios.post('/api/leagues', leagueData);
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

// Action asynchrone pour voir les ligues rejointes
// export const seeLeague = createAsyncThunk(
//   'leagues/seeLeague',
//   async ({ userId }: { userId: number }) => {
//     console.log('user id:', userId);
    
//     try {
//       console.log('before');
//       const response = await axios.get(`/api/leagues/user/${userId}`);
//       console.log('after')
//       return response.data; // Assurez-vous que ceci est un tableau d'objets de ligues
//     } catch (error) {
//       console.error('Failed to fetch leagues:', error);
//       throw error; // Propager l'erreur pour la gestion des erreurs
//     }
//   }
// );
// type SeeLeagueResponse = League[];

// export const seeLeague = createAsyncThunk<SeeLeagueResponse, { userId: number }>(
//   'leagues/seeLeague',
//   async ({ userId }) => {
//     try {
//       const response = await fetch(`/api/leagues/user/${userId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Request failed with status ${response.status}`);
//       }

//       const data = await response.json();
//       return data as SeeLeagueResponse;
//     } catch (error) {
//       console.error('Failed to fetch leagues:', error);
//       throw error;
//     }
//   }
// );

// Création du slice avec les reducers et les actions
const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createLeague.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeague.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues.push(action.payload);
        state.leagueCode = action.payload.leagueCode;
      })
      .addCase(createLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create league';
      })
      .addCase(joinLeague.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinLeague.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues.push(action.payload);
      })
      .addCase(joinLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to join league';
      })
      // .addCase(seeLeague.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(seeLeague.fulfilled, (state, action: PayloadAction<League[]>) => {
      //   state.loading = false;
      //   state.leagues = action.payload;
      // })
      // .addCase(seeLeague.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || 'Failed to fetch leagues';
      // });
  },
});

export default leagueSlice.reducer;

