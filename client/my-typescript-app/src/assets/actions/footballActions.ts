import { createAsyncThunk } from '@reduxjs/toolkit';
import { teamsData } from '../../data/playersData';


export const fetchCompetitions = createAsyncThunk(
'football/fetchCompetitions',
async () => {
const competitions = [
{ id: 1, name: 'Premier League' },
{ id: 2, name: 'La Liga' },
];
return competitions;
}
);

export const fetchTeams = createAsyncThunk(
'football/fetchTeams',
async (leagueId: any) => {
return teamsData;
}
);

export const fetchPlayers = createAsyncThunk(
'football/fetchPlayers',
async (teamId: number) => {
const team = teamsData.find((team) => team.id === teamId);
return team ? team.players : [];
}
);

