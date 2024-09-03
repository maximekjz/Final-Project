// src/components/GameExplanation.tsx
import React from 'react';

const GameExplanation: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
      <h1>Fantasy Football League: Game Explanation</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>Welcome to the Fantasy Football League!</h2>
        <p>This platform allows you and your friends to dive into the exciting world of fantasy football. Here’s how the game works:</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>1. Objective of the Game</h2>
        <p>The goal of the Fantasy Football League is to accumulate the highest number of points over the course of the season by creating a team of real-life football players from various leagues. Your team's performance is based on how these players perform in actual football matches. The better your players do on the field, the more points you score.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>2. Getting Started</h2>
        <ul>
          <li><strong>Create an Account:</strong> To get started, create an account on our platform. You’ll need to provide a username, email, and password.</li>
          <li><strong>Join or Create a League:</strong> After logging in, you can either join an existing league or create your own league and invite your friends to join. Each league is a private competition between you and your friends or other users.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>3. Selecting Your Team</h2>
        <p>Once you’re part of a league, it’s time to select your team. You can choose players from any of the clubs in the national leagues we support. Your team can consist of the following positions:</p>
        <ul>
          <li><strong>1 Goalkeeper</strong></li>
          <li><strong>1 Defenders</strong></li>
          <li><strong>1 Midfielders</strong></li>
          <li><strong>2 Forwards</strong></li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>4. The Point System</h2>
        <p>Your players earn points based on their real-life performances in matches. The point system is as follows:</p>
        <ul>
          <li><strong>Goalkeeper:</strong>
            <ul>
              <li>Starts with 3 points.</li>
              <li>+0.1 points per save.</li>
              <li>-1 point per goal conceded.</li>
            </ul>
          </li>
          <li><strong>Defenders:</strong>
            <ul>
              <li>Start with 3 points.</li>
              <li>+1 point for winning 50% or more of duels.</li>
              <li>+1 point for committing no fouls.</li>
              <li>-0.3 points per foul.</li>
            </ul>
          </li>
          <li><strong>Midfielders:</strong>
            <ul>
              <li>Start with 3 points.</li>
              <li>+1 point for winning 50% or more of duels.</li>
              <li>+1 point for completing 50% or more successful dribbles.</li>
              <li>+0.3 points per chance created.</li>
            </ul>
          </li>
          <li><strong>Forwards:</strong>
            <ul>
              <li>Start with 3 points.</li>
              <li>+0.8 points per goal scored.</li>
              <li>+0.2 points per shot on target.</li>
              <li>-0.3 points per shot off target.</li>
            </ul>
          </li>
          <li><strong>Penalties:</strong>
            <ul>
              <li>-1 point for a yellow card.</li>
              <li>-3 points for a red card.</li>
            </ul>
          </li>
        </ul>
        <p>Additionally, you can earn bonus points:</p>
        <ul>
          <li><strong>Best Team of the Matchday:</strong> Earn 10 extra points if your team has the best overall performance of the matchday.</li>
          <li><strong>Best Player of the Matchday:</strong> Earn 10 extra points if you correctly predict the top-performing player of the matchday.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>5. Managing Your Team</h2>
        <p>Each matchday, you can adjust your team, making transfers to swap out underperforming players or selecting new star players. Make sure you stay up-to-date with player injuries, suspensions, and form to maximize your points.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>6. League Rankings</h2>
        <p>After each matchday, the points are tallied, and a leaderboard is updated. You can view:</p>
        <ul>
          <li><strong>Overall Rankings:</strong> See how you stack up against other players in your league.</li>
          <li><strong>Matchday Rankings:</strong> Check out who had the best team for a particular matchday.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>7. Player and Club Views</h2>
        <p>Explore the stats of all the players and clubs. You can also ‘like’ your favorite players and clubs, and view your liked items on your profile page. This feature allows you to keep track of players you’re interested in, and see their performance history.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>8. Player Performance History</h2>
        <p>On your profile page, you can view the historical performance data of players you’ve liked or selected for your team. This data includes their matchday performances, and the remaining time until the next match.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>9. Winning the League</h2>
        <p>The winner of the league is the player with the most points at the end of the season. This player will have demonstrated excellent strategy in player selection, a deep understanding of the game, and maybe a little bit of luck!</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>10. Fair Play and Fun</h2>
        <p>Remember, the Fantasy Football League is all about fun and friendly competition. Respect your fellow players, enjoy the thrill of each matchday, and may the best manager win!</p>
      </section>
    </div>
  );
};

export default GameExplanation;
