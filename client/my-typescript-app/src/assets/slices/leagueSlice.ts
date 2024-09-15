import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Définition des types pour les données de ligue
interface League {
  id: number;
  name: string;
  championship_id: number;
  maxTeams: number;
  leagueCode: number;
  createdBy: number;
  numMatchdays: number;
}

// Définition des types pour l'état du slice
interface LeagueState {
  leagues: League[];          // Liste des ligues
  leagueCode: number | null;  // Code de la ligue créée ou jointe
  loading: boolean;           // État de chargement
  error: string | null;       // Message d'erreur
  ranking: LeagueRanking[],
  currentLeague: string | null;
}

interface LeagueRanking {
  id: number;
  league_id: number;
  team_id: number;
  rank: number;
  points: number;
  score: number;
  total_score: number;
  team_name: string;
  match_day?: number;
}

// État initial du slice
const initialState: LeagueState = {
  leagues: [],
  leagueCode: null,
  loading: false,
  error: null,
  ranking: [],
  currentLeague: null
};

// Action asynchrone pour créer une nouvelle ligue
export const createLeague = createAsyncThunk(
  'league/createLeague',
  async (leagueData: { name: string; championship: number; maxTeams: number; userId: number; numMatchdays: number }) => {
    const response = await axios.post('/api/leagues', leagueData);
    return response.data;  // Retour des données de la ligue créée
  }
);

// Action asynchrone pour rejoindre une ligue existante
export const joinLeague = createAsyncThunk(
  'league/joinLeague',
  async (data: { leagueCode: number; userId: number }) => {
    const response = await axios.post('/api/leagues/join', data);
    return response.data;  // Retour des données de la ligue rejointe
  }
);

// Action asynchrone pour voir les ligues rejointes
export const seeLeague = createAsyncThunk(
  'leagues/seeLeague',
  async ( userId: number ) => {
    console.log('user id:', userId);
    
    try {
      console.log('before');
      const response = await axios.get<League[]>(`/api/leagues/show/${userId}`);
      console.log('after')
      console.log('response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leagues:', error);
      throw error; 
    }
  }
);

export const fetchLeagueRanking = createAsyncThunk(
  'league/fetchLeagueRanking',
  async ({ leagueId, matchDay }: { leagueId: string, matchDay?: number }) => {
    console.log(`Fetching ranking for league ${leagueId}, matchDay ${matchDay}`);
    const response = await axios.get(`/api/leagues/${leagueId}/ranking`, {
      params: { matchDay },
    });
    console.log('Ranking data received:', response.data);
    return response.data;
  }
);

export const fetchLeagueDetails = createAsyncThunk(
  'league/fetchLeagueDetails',
  async (leagueId: string) => {
    const response = await axios.get(`/api/leagues/${leagueId}`);
    return response.data;
  }
);

export const updateRankings = createAsyncThunk(
  'league/updateRankings',
  async ({ leagueId, scores }: { leagueId: string, scores: any[] }) => {
    const response = await axios.post(`/api/leagues/${leagueId}/team-rank`, { leagueId, scores });
    return response.data;
  }
);

const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeagueRanking.pending, (state) => {
        console.log("fetchLeagueRanking pending");
        state.loading = true;
      })
      .addCase(fetchLeagueRanking.fulfilled, (state, action) => {
        console.log("fetchLeagueRanking fulfilled", action.payload);
        state.ranking = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeagueRanking.rejected, (state, action) => {
        console.log("fetchLeagueRanking rejected", action.error);
        state.error = action.error.message || 'Fail to fecth LeagueStands';
        state.loading = false;
      })
      .addCase(updateRankings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRankings.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fail to update rankings';
      })
      .addCase(fetchLeagueDetails.fulfilled, (state, action) => {
        const leagueIndex = state.leagues.findIndex(league => league.id === action.payload.id);
        if (leagueIndex !== -1) {
          state.leagues[leagueIndex] = action.payload;
        } else {
          state.leagues.push(action.payload);
        }
      })
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
      .addCase(seeLeague.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(seeLeague.fulfilled, (state, action: PayloadAction<League[]>) => {
        state.loading = false;
        state.leagues = action.payload;
        state.error = null;
      })
      .addCase(seeLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leagues';
      });
  },
});

export default leagueSlice.reducer;


