import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { addPlayerToTeam, removePlayerFromTeam } from '../actions/footballActions';

interface PlayerFormProps {
  selectedTeamId: number | null;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ selectedTeamId }) => {
  const dispatch: AppDispatch = useDispatch();
  const players = useSelector((state: RootState) => state.football.players);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [action, setAction] = useState<'add' | 'remove'>('add');

  useEffect(() => {
    setSelectedPlayerId(null);
  }, [selectedTeamId]);

  const handlePlayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayerId(Number(event.target.value));
  };

  const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(event.target.value as 'add' | 'remove');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedPlayerId && selectedTeamId) {
      const payload = { playerId: selectedPlayerId, teamId: selectedTeamId };
      if (action === 'add') {
        dispatch(addPlayerToTeam(payload));
      } else {
        dispatch(removePlayerFromTeam(payload));
      }
    }
  };

  return (
    <div>
      <h2>{action === 'add' ? 'Add Player to Team' : 'Remove Player from Team'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Action:
          <select value={action} onChange={handleActionChange}>
            <option value="add">Add</option>
            <option value="remove">Remove</option>
          </select>
        </label>
        <label>
          Player:
          <select value={selectedPlayerId || ''} onChange={handlePlayerChange}>
            <option value="">Select a player</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">{action === 'add' ? 'Add Player' : 'Remove Player'}</button>
      </form>
    </div>
  );
};

export default PlayerForm;

