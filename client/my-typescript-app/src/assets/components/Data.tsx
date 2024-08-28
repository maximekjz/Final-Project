import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchCompetitions, fetchTeams, fetchPlayers } from '../actions/footballActions';

const Data: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const competitions = useSelector((state: RootState) => state.football.competitions);
  const teams = useSelector((state: RootState) => state.football.teams);
  const players = useSelector((state: RootState) => state.football.players);
  const loading = useSelector((state: RootState) => state.football.loading);
  const error = useSelector((state: RootState) => state.football.error);

  // Exemple de sélection dynamique
  const selectedLeagueId = 'some-selected-league-id'; // À remplacer par la valeur sélectionnée
  const selectedTeamId = 'some-selected-team-id'; // À remplacer par la valeur sélectionnée

  useEffect(() => {
    dispatch(fetchCompetitions());

    if (selectedLeagueId) {
      dispatch(fetchTeams(selectedLeagueId));
    }

    if (selectedTeamId) {
      dispatch(fetchPlayers(selectedTeamId));
    }
  }, [dispatch, selectedLeagueId, selectedTeamId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Football Data</h1>

      <section>
        <h2>Competitions</h2>
        <ul>
          {competitions.map(comp => (
            <li key={comp.id}>{comp.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Teams</h2>
        <ul>
          {teams.map(team => (
            <li key={team.id}>{team.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Players</h2>
        {Object.keys(players).map(teamId => (
          <div key={teamId}>
            <h3>Team: {teamId}</h3>
            <ul>
              {players[teamId].map(player => (
                <li key={player.id}>
                  {player.name} - Goals: {player.goals}, Assists: {player.assists}, 
                  Chances Created: {player.chances_created}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Data;
