// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import footballReducer from './slices/footballSlice';
import leagueSlice from './slices/leagueSlice';
import teamReducer from './slices/teamSlice'

export const store = configureStore({
  reducer: {
    football: footballReducer,
    // players: playerReducer,
    league: leagueSlice,
    team: teamReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
