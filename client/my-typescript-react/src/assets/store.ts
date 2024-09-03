// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import footballSlice from './slices/footballSlice';
import leagueSlice from './slices/leagueSlice'

export const store = configureStore({
  reducer: {
    football: footballSlice,
    // players: playerReducer,
    league: leagueSlice,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
