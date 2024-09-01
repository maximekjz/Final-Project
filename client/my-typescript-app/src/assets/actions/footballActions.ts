import { createAsyncThunk } from '@reduxjs/toolkit';
import { teamsData } from '../../data/playersData';

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