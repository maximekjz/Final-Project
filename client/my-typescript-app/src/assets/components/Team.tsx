import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchTeamDetails } from '../slices/teamSlice';  
import { Player } from '../slices/footballSlice';

interface TeamProps {
    teamId: number;
}

const Team: React.FC<TeamProps> = ({ teamId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const team = useSelector((state: RootState) => state.team.details);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTeamDetails = async () => {
            try {
                await dispatch(fetchTeamDetails(teamId)).unwrap();
            } catch (err) {
                setError('Failed to fetch team details');
            }
        };

        loadTeamDetails();
    }, [dispatch, teamId]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Team Details</h1>
            <h2>Team ID: {teamId}</h2>
            <h3>Players in the Team</h3>
            <ul>
                {team?.players.map((player: Player) => (
                    <li key={player.id}>
                        Player ID: {player.id} - Position: {player.position}
                    </li>
                )) || <li>No players found.</li>}
            </ul>
        </div>
    );
};

export default Team;
