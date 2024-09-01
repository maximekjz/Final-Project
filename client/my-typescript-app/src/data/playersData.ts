import playersData from './data_players.json'

export const teamsData = playersData.leagues.flatMap(league => league.teams);
