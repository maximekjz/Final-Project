import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Définition des types pour les données de ligue
export interface TeamData {
  id?: number;
  name: string;
  championship_id: number;
  league_id: string;
  match_day: number;
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


// export const createTeam = createAsyncThunk<TeamData, Omit<TeamData, 'id'>, { rejectValue: string }>(
//   'team/createTeam',
//   async (teamData, { rejectWithValue }) => {
//     try {
//       console.log('Creating team with data:', teamData); 
//       const response = await axios.post('http://localhost:3000/api/teams/create', teamData);
//       console.log('Create team response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error in createTeam thunk:', error);
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.message || error.message);
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// export const updateTeam = createAsyncThunk<TeamData, TeamData, { rejectValue: string }>(
//   'team/updateTeam',
//   async (teamData, { rejectWithValue }) => {
//     try {
//       console.log('Sending update request with data:', teamData);
//       const response = await axios.put(`http://localhost:3000/api/teams/${teamData.id}`, teamData);
//       console.log('Update response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error in updateTeam thunk:', error);
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.message || error.message);
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

export const addOrUpdateTeam = createAsyncThunk<TeamData, Omit<TeamData, 'id'>, { rejectValue: string }>(
  'team/addOrUpdateTeam',
  async (teamData, { rejectWithValue }) => {
    try {
      console.log('Adding or updating team with data:', teamData); 
      const response = await axios.post('http://localhost:3000/api/teams/create', teamData);
      console.log('Add or update team response:', response.data);
      return response.data.team;
    } catch (error) {
      console.error('Error in addOrUpdateTeam thunk:', error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
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
    // .addCase(updateTeam.fulfilled, (state, action) => {
    //   console.log('Updating team:', action.payload);
    //   const index = state.teams.findIndex(team => team.id === action.payload.id);
    //   if (index !== -1) {
    //     state.teams[index] = action.payload;
    //   }
    // })
    //   .addCase(createTeam.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(createTeam.fulfilled, (state, action) => {
    //     console.log('Creating new team:', action.payload);
    //     state.teams.push(action.payload);
    //   })
    //   .addCase(createTeam.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message || 'Failed to create team';
    //   })
    .addCase(addOrUpdateTeam.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addOrUpdateTeam.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.teams.findIndex(team => team.id === action.payload.id);
      if (index !== -1) {
        // Update existing team
        state.teams[index] = action.payload;
      } else {
        // Add new team
        state.teams.push(action.payload);
      }
    })
    .addCase(addOrUpdateTeam.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to add or update team';
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