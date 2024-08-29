import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Définition de l'interface pour l'état des ligues.
// `leagues`: tableau de ligues existantes.
// `currentLeague`: la ligue à laquelle l'utilisateur est actuellement inscrit.
// `error`: message d'erreur en cas de problème.
interface LeagueState {
    leagues: League[];
    currentLeague: League | null;
    error: string | null;
  }
  
  // État initial avec une liste vide de ligues et aucune ligue sélectionnée.
  const initialState: LeagueState = {
    leagues: [],
    currentLeague: null,
    error: null,
  };


// Création d'un slice pour gérer les actions liées aux ligues.
// `createLeagueSuccess`: Ajoute une nouvelle ligue à l'état.
// `joinLeagueSuccess`: Définit la ligue actuelle lorsque l'utilisateur rejoint une ligue.
// `setError`: Définit un message d'erreur en cas de problème.
const leagueSlice = createSlice({
    name: 'league',
    initialState,
    reducers: {
      createLeagueSuccess(state, action: PayloadAction<League>) {
        state.leagues.push(action.payload);
      },
      joinLeagueSuccess(state, action: PayloadAction<League>) {
        state.currentLeague = action.payload;
      },
      setError(state, action: PayloadAction<string>) {
        state.error = action.payload;
      },
    },
  });
  
// Exportation des actions pour les utiliser dans les composants ou les thunks.
export const { createLeagueSuccess, joinLeagueSuccess, setError } = leagueSlice.actions;
  
// Exportation du reducer pour l'intégrer au store Redux.
export default leagueSlice.reducer;