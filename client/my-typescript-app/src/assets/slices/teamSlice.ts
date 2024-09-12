import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Définition des types pour les données de ligue
interface TeamData {
  id?: number;
  name: string;
  championship_id: number;
  league_id: string;
  gk?: number;
  def?: number;
  mid?: number;
  forward1?: number;
  forward2?: number;
  user_id: number
}

// Définition des types pour l'état du slice
interface TeamState {
  teams: TeamData[];          // Liste des ligues
  loading: boolean;           // État de chargement
  error: string | null;       // Message d'erreur
}

// État initial du slice
const initialState: TeamState = {
  teams: [],
  loading: false,
  error: null,
};

// Action asynchrone pour créer une nouvelle ligue
export const createTeam = createAsyncThunk(
  'team/addTeam',
  async (teamData: TeamData) => {
    const response = await axios.post('http://localhost:3000/api/teams/create', teamData);
    return response.data;
  }
);


export const seeTeam = createAsyncThunk(
  'team/seeTeam',
  async (userId: number) => {
    const response = await axios.get(`http://localhost:3000/api/teams/show/${userId}`);
    return response.data;
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action: PayloadAction<TeamData>) => {
        state.loading = false;
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create team';
      })
      .addCase(seeTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(seeTeam.fulfilled, (state, action: PayloadAction<TeamData[]>) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(seeTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teams';
      });
  }
});

export default teamSlice.reducer;