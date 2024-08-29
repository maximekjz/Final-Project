// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import footballReducer from './slices/footballSlice';

export const store = configureStore({
  reducer: {
    football: footballReducer,
    // players: playerReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
