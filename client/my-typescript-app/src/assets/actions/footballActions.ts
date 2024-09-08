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


export const removeTeam = createAsyncThunk(
  'football/removeTeam',
  async ({ user_id, championship_id, league_id, match_day }: { user_id: number; championship_id: number; league_id: string; match_day: number }) => {
    try {
      const response = await axios.delete('/team', { data: { user_id, championship_id, league_id, match_day } });
      return response.data;
    } catch (error) {
      console.error('Error removing team:', error);
      throw error;
    }
  }
);

export const getTeams = createAsyncThunk(
  'football/getTeams',
  async (user_id: number) => {
    try {
      const response = await axios.get(`/team/${user_id}`);
      return response.data.teams;
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  }
);

export const addTeam = createAsyncThunk(
  'football/addTeam',
  async ({ user_id, championship_id, league_id, match_day, gk, def, mid, forward1, forward2 }: { user_id: number; championship_id: number; league_id: string; match_day: number; gk: number; def: number; mid: number; forward1: number; forward2: number }) => {
      try {
          const response = await axios.post('/team', { user_id, championship_id, league_id, match_day, gk, def, mid, forward1, forward2 });
          return response.data;
      } catch (error) {
          console.error('Error adding team:', error);
          throw error;
      }
  }
);

export const addPlayerToTeam = createAsyncThunk(
  'football/addPlayerToTeam',
  async ({ teamId, playerId }: { teamId: number; playerId: number }, thunkAPI) => {
      try {
          const response = await axios.post('/team/addPlayer', { teamId, playerId });
          return response.data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error.response.data);
      }
  }
);

export const removePlayerFromTeam = createAsyncThunk(
  'football/removePlayerFromTeam',
  async ({ teamId, playerId }: { teamId: number; playerId: number }, thunkAPI) => {
      try {
          const response = await axios.delete('/team/removePlayer', { data: { teamId, playerId } });
          return response.data;
      } catch (error) {
          return thunkAPI.rejectWithValue(error.response.data);
      }
  }
);
