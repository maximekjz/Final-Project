export interface Player {
    name: string;           // Nom du joueur
    position: string;       // Poste du joueur (ex: 'Attaquant', 'Défenseur')
    teamName?: string;       // Nom de l'équipe du joueur
    // Ajoutez d'autres propriétés ici si nécessaire
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
