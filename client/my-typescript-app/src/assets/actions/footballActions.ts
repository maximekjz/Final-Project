import { createAsyncThunk } from '@reduxjs/toolkit';
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

export const fetchCurrentSeason = createAsyncThunk(
  'football/fetchCurrentSeason',
  async (leagueId: number) => {
    try {
      const response = await axios.get(`/api/v3/football/leagues/${leagueId}?api_token=${API_KEY}&include=currentSeason`);
      console.log('API Response:', response);
      return response.data.data.currentSeason;
    } catch (error) {
      console.error('Error fetching current season:', error);
      throw error;
    }
  }
);

export const fetchTeams = createAsyncThunk(
  'football/fetchTeams',
  async (seasonId: number) => {
    try {
      const response = await axios.get(`/api/v3/football/seasons/${seasonId}/teams`, {
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
