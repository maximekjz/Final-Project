import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createLeagueSuccess, joinLeagueSuccess, setError } from '../slices/leagueSlice';

// Action pour créer une ligue.
// `createLeague`: Crée une nouvelle ligue avec un ID généré aléatoirement.
export const createLeague = createAsyncThunk(
  'league/createLeague',
  async ({ championshipId, maxTeams }: { championshipId: number; maxTeams: number }, { dispatch }) => {
    try {
      // Génération d'un code de ligue aléatoire.
      const leagueCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Requête API pour créer une nouvelle ligue avec le code généré.
      const response = await axios.post('/api/leagues', { championshipId, maxTeams, leagueCode });

      // En cas de succès, on ajoute la nouvelle ligue à l'état global via l'action `createLeagueSuccess`.
      dispatch(createLeagueSuccess(response.data));
    } catch (error) {
      // En cas d'erreur, on définit un message d'erreur dans l'état global via l'action `setError`.
      dispatch(setError('Error creating league.'));
    }
  }
);

// Action pour rejoindre une ligue.
// `joinLeague`: Rejoint une ligue existante en utilisant un code de ligue.
export const joinLeague = createAsyncThunk(
  'league/joinLeague',
  async (leagueCode: string, { dispatch }) => {
    try {
      // Requête API pour rejoindre une ligue via le code fourni.
      const response = await axios.post('/api/leagues/join', { leagueCode });

      // En cas de succès, on définit la ligue actuelle avec les données récupérées via l'action `joinLeagueSuccess`.
      dispatch(joinLeagueSuccess(response.data));
    } catch (error) {
      // En cas d'erreur, on définit un message d'erreur dans l'état global via l'action `setError`.
      dispatch(setError('Error joining league.'));
    }
  }
);