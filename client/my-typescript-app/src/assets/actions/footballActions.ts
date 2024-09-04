import { createAsyncThunk } from '@reduxjs/toolkit';
import { teamsData } from '../../data/playersData';
import { Team, Player } from '../slices/footballSlice';
import axios from 'axios';

export const fetchCompetitions = createAsyncThunk(
  'football/fetchCompetitions',
  async () => {
    // Simule la récupération des compétitions
    const competitions = [
      { id: 1, name: 'Premier League' },
      { id: 2, name: 'La Liga' },
      // Ajoutez ici d'autres compétitions si nécessaire
    ];
    return competitions;
  }
);

export const fetchTeams = createAsyncThunk(
  'football/fetchTeams',
  async (leagueId: number) => {
    // Simule la récupération des équipes pour une ligue donnée
    return teamsData; // Retourne toutes les équipes
  }
);

export const fetchPlayers = createAsyncThunk(
  'football/fetchPlayers',
  async (teamId: number) => {
    // Récupère les joueurs pour l'équipe sélectionnée
    const team = teamsData.find((team) => team.id === teamId);
    return team ? team.players : [];
  }
);

export const addTeam = createAsyncThunk(
  'football/addTeam',
  async ({ user_id, championship_id, league_id, match_day, gk, def, mid, forward1, forward2 }: { user_id: number; championship_id: number; league_id: number; match_day: number; gk: string; def: string; mid: string; forward1: string; forward2: string }) => {
    try {
      const response = await axios.post('/api/team', { user_id, championship_id, league_id, match_day, gk, def, mid, forward1, forward2 });
      return response.data;
    } catch (error) {
      console.error('Error adding team:', error);
      throw error;
    }
  }
);

export const removeTeam = createAsyncThunk(
  'football/removeTeam',
  async ({ user_id, championship_id, league_id, match_day }: { user_id: number; championship_id: number; league_id: number; match_day: number }) => {
    try {
      const response = await axios.delete('/api/team', { data: { user_id, championship_id, league_id, match_day } });
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
      const response = await axios.get(`/api/team/${user_id}`);
      return response.data.teams;
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  }
);

export const addPlayerToTeam = createAsyncThunk(
  'football/addPlayerToTeam',
  async ({ teamId, playerId }: { teamId: number, playerId: number }, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:3000/api/team/addPlayer', {
        teamId,
        playerId
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removePlayerFromTeam = createAsyncThunk(
  'football/removePlayerFromTeam',
  async ({ teamId, playerId }: { teamId: number, playerId: number }, thunkAPI) => {
    try {
      const response = await axios.delete('http://localhost:3000/api/team/removePlayer', {
        data: { teamId, playerId }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


/**                  Code with API
 * 
 * import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = 'W3KKZPEHytA7Hujm2xepz39jwCMgpiJXtdse4uuNILoVcZ2n0HVNsnXMDAbN';

export const fetchCompetitions = createAsyncThunk(
  'football/fetchCompetitions',
  async () => {
    try {
      const response = await axios.get('/api/v3/football/leagues', {
        params: { api_token: API_KEY },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching competitions:', error);
      throw error;
    }
  }
);



export const fetchTeams = createAsyncThunk(
  'football/fetchTeams',
  async (leagueId: number) => {
    try {
      const response = await axios.get(`/api/v3/football/leagues/${leagueId}/teams`, {
        params: { api_token: API_KEY },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }
);

export const fetchPlayers = createAsyncThunk(
  'football/fetchPlayers',
  async (payload: { teamId: number; seasonId: number }) => {
    const { teamId } = payload;
    try {
      const response = await axios.get(`/api/v3/football/teams/${teamId}/players`, {
        params: { api_token: API_KEY, include: 'stats' },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  }
);
*/