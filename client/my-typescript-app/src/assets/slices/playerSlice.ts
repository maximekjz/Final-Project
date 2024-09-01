/** API
 * 
 * 
 * import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = 'W3KKZPEHytA7Hujm2xepz39jwCMgpiJXtdse4uuNILoVcZ2n0HVNsnXMDAbN';

export const searchPlayers = createAsyncThunk(
  'players/searchPlayers',
  async (searchTerm: string) => {
    try {
      const response = await axios.get('https://api.sportmonks.com/v3/football/players', {
        params: { api_token: API_KEY, search: searchTerm },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching players:', error);
      throw error;
    }
  }
);

const playerSlice = createSlice({
  name: 'players',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchPlayers.fulfilled, (state, action) => action.payload)
      .addCase(searchPlayers.rejected, (state, action) => {
        console.error('Failed to fetch players:', action.error);
      });
  },
});

export default playerSlice.reducer;
*/