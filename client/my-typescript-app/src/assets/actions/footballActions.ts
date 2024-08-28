import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Remplacez par votre clé d'API SportMonks
const API_KEY = 'W3KKZPEHytA7Hujm2xepz39jwCMgpiJXtdse4uuNILoVcZ2n0HVNsnXMDAbN';
const API_BASE_URL = 'https://api.sportmonks.com/v3/football';

// Fonction pour configurer les headers de la requête
const getHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    }
  });
  
  export const fetchCompetitions = createAsyncThunk(
    'football/fetchCompetitions',
    async () => {
      const response = await axios.get(`${API_BASE_URL}/competitions`, getHeaders());
      return response.data.data;
    }
  );
  
  export const fetchTeams = createAsyncThunk(
    'football/fetchTeams',
    async (leagueId: string) => {
      const response = await axios.get(`${API_BASE_URL}/teams/league/${leagueId}`, getHeaders());
      return { leagueId, teams: response.data.data };
    }
  );
  
  export const fetchPlayers = createAsyncThunk(
    'football/fetchPlayers',
    async (teamId: string) => {
      const response = await axios.get(`${API_BASE_URL}/squad/season/2024/team/${teamId}`, getHeaders());
      return { teamId, players: response.data.data };
    }
  );