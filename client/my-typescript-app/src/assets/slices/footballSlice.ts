import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCompetitions, fetchTeams, fetchPlayers, addPlayerToTeam, removePlayerFromTeam, addTeam, removeTeam, updateTeam } from '../actions/footballActions';

interface Competition {
id: number;
name: string;
}

export interface Player {
id: number;
name: string;
position: string;
teamName?: string;
previous_season_stats?: {
appearances: number;
goals: number;
assists: number;
clean_sheets?: number;
saves?: number;
goals_conceded?: number;
duels_won_percentage?: number;
shots_on_target?: number;
shots_off_target?: number;
chances_created?: number;
yellow_cards?: number;
red_cards?: number;
};
current_season_stats?: {
match_1?: {
goals: number;
assists: number;
duels_won_percentage: number;
saves?: number;
goals_conceded?: number;
shots_on_target?: number;
shots_off_target?: number;
chances_created?: number;
};
};
}

export interface Team {
id: number;
name: string;
players: Player[];
user_id?: number;
championship_id?: number;
match_day?: number;
gk?: string;
def?: string;
mid?: string;
forward1?: string;
forward2?: string;
league_id?: number;
}

interface FootballState {
competitions: Competition[];
teams: Team[];
players: Player[];
selectedLeagueId: number | null;
loading: boolean;
error: string | null;
selectedTeam: Team | null;
}

const initialState: FootballState = {
competitions: [],
teams: [],
players: [],
selectedLeagueId: null,
loading: false,
error: null,
selectedTeam: null,
};

const footballSlice = createSlice({
name: 'football',
initialState,
reducers: {
setSelectedLeagueId: (state, action: PayloadAction<number>) => {
state.selectedLeagueId = action.payload;
},
clearSelectedLeagueId: (state) => {
state.selectedLeagueId = null;
},
selectTeam: (state, action: PayloadAction<Team>) => {
state.selectedTeam = action.payload;
},
clearSelectedTeam: (state) => {
state.selectedTeam = null;
},
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
const teamsWithTeamName = action.payload.map((team) => ({
...team,
players: team.players.map((player) => ({
...player,
teamName: team.name,
})),
}));
state.teams = teamsWithTeamName;
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
})
// Add player to team
.addCase(addPlayerToTeam.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(addPlayerToTeam.fulfilled, (state, action) => {
  state.loading = false;
  // Update state as needed after adding a player
  // For example, you might need to update the player's team in your state
})
.addCase(addPlayerToTeam.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || 'Failed to add player to team';
})
// Remove player from team
.addCase(removePlayerFromTeam.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(removePlayerFromTeam.fulfilled, (state, action) => {
  state.loading = false;
  // Update state as needed after removing a player
  // For example, you might need to update the player's team in your state
})
.addCase(removePlayerFromTeam.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || 'Failed to remove player from team';
})
// Add team
.addCase(addTeam.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(addTeam.fulfilled, (state, action) => {
  state.loading = false;
  state.teams.push(action.payload);
})
.addCase(addTeam.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || 'Failed to add team';
})
// Remove team
.addCase(removeTeam.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(removeTeam.fulfilled, (state, action) => {
  state.loading = false;
  state.teams = state.teams.filter(team => team.id !== action.payload);
})
.addCase(removeTeam.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || 'Failed to remove team';
})
// Update team
.addCase(updateTeam.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateTeam.fulfilled, (state, action) => {
  state.loading = false;
  state.teams = state.teams.map(team =>
    team.id === action.payload.id ? action.payload : team
  );
})
.addCase(updateTeam.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || 'Failed to update team';
});
},
});
export const { setSelectedLeagueId, clearSelectedLeagueId, selectTeam, clearSelectedTeam } = footballSlice.actions;
export default footballSlice.reducer;

