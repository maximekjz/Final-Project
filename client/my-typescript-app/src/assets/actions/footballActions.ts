import { createAsyncThunk } from '@reduxjs/toolkit';
import { teamsData } from '../../data/playersData';
import { Team, Player } from '../slices/footballSlice';
import axios from 'axios';

export const fetchCompetitions = createAsyncThunk(
'football/fetchCompetitions',
async () => {
const competitions = [
{ id: 1, name: 'Premier League' },
{ id: 2, name: 'La Liga' },
];
return competitions;
}
);

export const fetchTeams = createAsyncThunk(
'football/fetchTeams',
async (leagueId: any) => {
return teamsData;
}
);

export const fetchPlayers = createAsyncThunk(
'football/fetchPlayers',
async (teamId: number) => {
const team = teamsData.find((team) => team.id === teamId);
return team ? team.players : [];
}
);

interface PlayerTeamPayload {
  playerId: number;
  teamId: number;
}


export const addPlayerToTeam = createAsyncThunk(
  'teams/addPlayerToTeam',
  async (payload: PlayerTeamPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/teams/addPlayer', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add player to team');
    }
  }
);

// Remove a player from a team
export const removePlayerFromTeam = createAsyncThunk(
  'teams/removePlayerFromTeam',
  async (payload: PlayerTeamPayload, { getState }) => {
    const state = getState() as { football: { selectedTeamId: number } };
    const teamId = state.football.selectedTeamId;
    if (!teamId) throw new Error('No team selected');

    const response = await axios.post('/api/teams/remove-player', payload);
    return response.data
  }
);

// Add a new team
export const addTeam = createAsyncThunk(
  'teams/addTeam',
  async (team: Team) => {
    const response = await axios.post('/api/teams/create', team);
    return response.data;
  }
);

// Remove a team
export const removeTeam = createAsyncThunk(
  'teams/removeTeam',
  async (teamId: number) => {
    await axios.delete(`/api/teams/${teamId}`);
    return teamId;
  }
);

// Update team details
export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async (team: Team) => {
    const response = await axios.put(`/api/teams/${team.id}`, team);
    return response.data;
  }
);
