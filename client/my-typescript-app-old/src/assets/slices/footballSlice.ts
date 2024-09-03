import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCompetitions, fetchTeams, fetchPlayers } from '../actions/footballActions';

interface Competition {
  id: number;
  name: string;
}

export interface Player {
  id: number; // Ajout de l'ID
  name: string;
  position: string;
  teamName?: string; // Marqué comme optionnel pour les cas où il pourrait être absent
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
    // Ajouter d'autres matchs si nécessaire
  };
}

export interface Team {
  id: number;
  name: string;
  players: Player[]; // Ajout de la propriété players
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
            teamName: team.name, // Ajouter le nom de l'équipe à chaque joueur
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
      });
  },
});

export const { setSelectedLeagueId } = footballSlice.actions;
export default footballSlice.reducer;
