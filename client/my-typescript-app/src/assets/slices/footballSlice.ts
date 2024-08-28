import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCompetitions, fetchTeams, fetchPlayers } from '../actions/footballActions';

interface Competition {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

interface PlayerStats {
  id: string;
  name: string;
  duels_won: number;
  fouls_committed: number;
  saves: number; // Pour les gardiens
  goals_conceded: number; // Pour les gardiens
  shots_on_target: number;
  shots_off_target: number;
  goals: number;
  assists: number;
  chances_created: number;
}

interface FootballState {
  competitions: Competition[];
  teams: Team[];
  players: Record<string, PlayerStats[]>; // Mapping des équipes aux joueurs
  loading: boolean;
  error: string | null;
}

const initialState: FootballState = {
  competitions: [],
  teams: [],
  players: {},
  loading: false,
  error: null,
};

const footballSlice = createSlice({
  name: 'football',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompetitions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetitions.fulfilled, (state, action: PayloadAction<Competition[]>) => {
        state.competitions = action.payload;
        state.loading = false;
      })
      .addCase(fetchCompetitions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch competitions';
      })
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action: PayloadAction<{ leagueId: string, teams: Team[] }>) => {
        state.teams = action.payload.teams;
        state.loading = false;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teams';
      })
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action: PayloadAction<{ teamId: string, players: PlayerStats[] }>) => {
        state.players[action.payload.teamId] = action.payload.players;
        state.loading = false;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch players';
      });
  },
});

export default footballSlice.reducer;
