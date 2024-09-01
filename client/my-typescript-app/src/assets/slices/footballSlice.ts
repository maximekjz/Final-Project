import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCompetitions, fetchTeams, fetchPlayers } from '../actions/footballActions';

interface Competition {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

interface Player {
  name: string;
  position: string;
  previous_season_stats: any;
  current_season_stats: any;
}

interface FootballState {
  competitions: Competition[];
  teams: Team[];
  players: Player[];
  selectedLeagueId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: FootballState = {
  competitions: [],
  teams: [],
  players: [],
  selectedLeagueId: null,
  loading: false,
  error: null,
};

const footballSlice = createSlice({
  name: 'football',
  initialState,
  reducers: {
    setSelectedLeagueId: (state, action: PayloadAction<number>) => {
      state.selectedLeagueId = action.payload;
    }
  },
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
      .addCase(fetchTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.teams = action.payload;
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
      .addCase(fetchPlayers.fulfilled, (state, action: PayloadAction<Player[]>) => {
        state.players = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch players';
      });
  },
});

export const { setSelectedLeagueId } = footballSlice.actions;
export default footballSlice.reducer;



/**              Code with API
 * 
 * 
 * import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCompetitions, fetchTeams, fetchPlayers } from '../actions/footballActions';

interface Competition {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

interface Player {
  id: number;
  name: string;
  goals: number;
  assists: number;
  duelsWon: number;
  saves: number;
  goalsConceded: number;
  shotsOnTarget: number;
  shotsOffTarget: number;
  chancesCreated: number;
}

interface FootballState {
  competitions: Competition[];
  currentSeason: any;
  teams: Team[];
  players: Player[];
  selectedLeagueId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: FootballState = {
  competitions: [],
  currentSeason: null,
  teams: [],
  players: [],
  selectedLeagueId: null,
  loading: false,
  error: null,
};

const footballSlice = createSlice({
  name: 'football',
  initialState,
  reducers: {
    setSelectedLeagueId: (state, action: PayloadAction<number>) => {
      state.selectedLeagueId = action.payload;
    }
  },
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
      .addCase(fetchTeams.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.teams = action.payload;
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
      .addCase(fetchPlayers.fulfilled, (state, action: PayloadAction<Player[]>) => {
        state.players = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch players';
      });
  },
});

export const { setSelectedLeagueId } = footballSlice.actions;
export default footballSlice.reducer;

*/