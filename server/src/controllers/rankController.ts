// import { Request, Response } from 'express';
// import { db } from '../config/db';
 
// export const addRank = async (req: Request, res: Response) => {
//   const { leagueId, scores } = req.body;
  
//   try {
//     await db.transaction(async trx => {
//       for (let score of scores) {
//         // Insérer ou mettre à jour le score pour la journée
//         await trx.raw(`
//           INSERT INTO league_matchday_rankings (league_id, team_id, match_day, score, points)
//           VALUES (?, ?, ?, ?, ?)
//           ON CONFLICT (league_id, team_id, match_day)
//           DO UPDATE SET 
//             score = league_matchday_rankings.score + EXCLUDED.score,
//             points = league_matchday_rankings.points + EXCLUDED.points
//         `, [leagueId, score.team_id, score.match_day, score.score, Math.round(score.score)]);

//         // Mettre à jour le classement général
//         await trx.raw(`
//           INSERT INTO league_overall_rankings (league_id, team_id, total_score, points)
//           VALUES (?, ?, ?, ?)
//           ON CONFLICT (league_id, team_id)
//           DO UPDATE SET 
//             total_score = league_overall_rankings.total_score + EXCLUDED.total_score,
//             points = league_overall_rankings.points + EXCLUDED.points
//         `, [leagueId, score.team_id, score.score, Math.round(score.score)]);
//       }

//       // Mettre à jour les rangs pour le classement de la journée
//       await trx.raw(`
//         UPDATE league_matchday_rankings
//         SET rank = subquery.rank
//         FROM (
//           SELECT id, ROW_NUMBER() OVER (
//             PARTITION BY league_id, match_day 
//             ORDER BY points DESC, score DESC
//           ) as rank
//           FROM league_matchday_rankings
//           WHERE league_id = ?
//         ) AS subquery
//         WHERE league_matchday_rankings.id = subquery.id
//       `, [leagueId]);

//       // Mettre à jour les rangs pour le classement général
//       await trx.raw(`
//         UPDATE league_overall_rankings
//         SET rank = subquery.rank
//         FROM (
//           SELECT id, ROW_NUMBER() OVER (
//             PARTITION BY league_id
//             ORDER BY points DESC, total_score DESC
//           ) as rank
//           FROM league_overall_rankings
//           WHERE league_id = ?
//         ) AS subquery
//         WHERE league_overall_rankings.id = subquery.id
//       `, [leagueId]);
//     });

//     res.json({ message: 'Scores saved and rankings updated successfully' });
//   } catch (error) {
//     console.error('Error saving scores and updating rankings:', error);
//     res.status(500).json({ error: 'Failed to save scores and update rankings' });
//   }
// };
