import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Player } from './footballSlice';

interface TeamState {
    details: {
        id: number;
        players: Player[];
    } | null;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: TeamState = {
    details: null,
    status: 'idle',
};

// Thunk pour récupérer les détails de l'équipe
export const fetchTeamDetails = createAsyncThunk(
    'team/fetchTeamDetails',
    async (teamId: number) => {
        const response = await axios.get(`/api/teams/${teamId}`);
        return response.data;
    }
);

const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeamDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTeamDetails.fulfilled, (state, action) => {
                state.status = 'idle';
                state.details = action.payload;
            })
            .addCase(fetchTeamDetails.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export default teamSlice.reducer;
