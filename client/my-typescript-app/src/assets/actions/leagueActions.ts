import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLeagues = createAsyncThunk(
  'football/fetchLeagues',
  async (allLeagues:string) => {
    return leagueCode;
  }
);
