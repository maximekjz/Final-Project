import playersData from './data_players.json'

export const teamsData = playersData.leagues.flatMap(league => league.teams);

// types.ts ou dans le fichier où le type Player est défini
export interface Player {
    id: number;             // Identifiant unique du joueur
    name: string;           // Nom du joueur
    position: string;       // Poste du joueur (ex: 'Attaquant', 'Défenseur')
    teamName: string;       // Nom de l'équipe du joueur
    previous_season_stats?: {
      appearances: number;
      goals: number;
      assists: number;
      clean_sheets?: number;
      saves?: number;
      goals_conceded?: number;
      duels_won_percentage?: number;
      shots_on_target?: number;
      shots_off_target?: number;
      chances_created?: number;
      yellow_cards?: number;
      red_cards?: number;
    };
  }
  