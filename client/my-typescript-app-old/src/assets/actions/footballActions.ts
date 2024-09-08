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
