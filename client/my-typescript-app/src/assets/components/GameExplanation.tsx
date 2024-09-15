import React from 'react';

const GameExplanation: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5em' }}>⚽ Fantasy Football League: Game Explanation ⚽</h1>

      {/* Sommaire */}
      <nav style={{ margin: '20px 0', textAlign: 'center' }}>
        <h2>Table of Contents</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><a href="#welcome" style={{ color: '#007bff' }}>1. Welcome to the Fantasy Football League 🎉</a></li>
          <li><a href="#objective" style={{ color: '#007bff' }}>2. Objective of the Game 🏆</a></li>
          <li><a href="#getting-started" style={{ color: '#007bff' }}>3. Getting Started 🚀</a></li>
          <li><a href="#selecting-team" style={{ color: '#007bff' }}>4. Selecting Your Team 📋</a></li>
          <li><a href="#points-system" style={{ color: '#007bff' }}>5. The Point System 📊</a></li>
          <li><a href="#managing-team" style={{ color: '#007bff' }}>6. Managing Your Team 🔄</a></li>
          <li><a href="#league-rankings" style={{ color: '#007bff' }}>7. League Rankings 📈</a></li>
          <li><a href="#player-club-views" style={{ color: '#007bff' }}>8. Player and Club Views 👀</a></li>
          <li><a href="#player-performance" style={{ color: '#007bff' }}>9. Player Performance History 📅</a></li>
          <li><a href="#winning-league" style={{ color: '#007bff' }}>10. Winning the League 🥇</a></li>
        </ul>
      </nav>

      {/* Sections */}
      <section id="welcome" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>Welcome to the Fantasy Football League! 🎉</h2>
        <p>This platform allows you and your friends to dive into the exciting world of fantasy football. Here’s how the game works:</p>
      </section>

      <section id="objective" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>1. Objective of the Game 🏆</h2>
        <p>The goal of the Fantasy Football League is to accumulate the highest number of points over the course of the season by creating a team of real-life football players from various leagues. Your team's performance is based on how these players perform in actual football matches. The better your players do on the field, the more points you score.</p>
      </section>

      <section id="getting-started" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>2. Getting Started 🚀</h2>
        <ul>
          <li><strong>Create an Account:</strong> To get started, create an account on our platform. You’ll need to provide a username, email, and password.</li>
          <li><strong>Join or Create a League:</strong> After logging in, you can either join an existing league or create your own league and invite your friends to join. Each league is a private competition between you and your friends or other users.</li>
        </ul>
      </section>

      <section id="selecting-team" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>3. Selecting Your Team 📋</h2>
        <p>Once you’re part of a league, it’s time to select your team. You can choose players from any of the clubs in the national leagues we support. Your team can consist of the following positions:</p>
        <ul>
          <li><strong>1 Goalkeeper 🧤</strong></li>
          <li><strong>1 Defender 🛡️</strong></li>
          <li><strong>1 Midfielder 🏃</strong></li>
          <li><strong>2 Forwards ⚽</strong></li>
        </ul>
      </section>

      <section id="points-system" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>4. The Point System 📊</h2>
        <p>Your players earn points based on their real-life performances in matches. The point system is as follows:</p>
        <ul>
          <li><strong>Goalkeeper 🧤:</strong>
            <ul>
              <li>Starts with 3 points.</li>
              <li>+0.1 points per save.</li>
              <li>-1 point per goal conceded.</li>
            </ul>
          </li>
          <li><strong>Defenders 🛡️:</strong>
            <ul>
              <li>Start with 3 points.</li>
              <li>+1 point for winning 50% or more of duels.</li>
              <li>+1 point for committing no fouls.</li>
              <li>-0.3 points per foul.</li>
            </ul>
          </li>
          <li><strong>Midfielders 🏃:</strong>
            <ul>
              <li>Start with 3 points.</li>
              <li>+1 point for winning 50% or more of duels.</li>
              <li>+1 point for completing 50% or more successful dribbles.</li>
              <li>+0.3 points per chance created.</li>
            </ul>
          </li>
          <li><strong>Forwards ⚽:</strong>
            <ul>
              <li>Start with 3 points.</li>
              <li>+0.8 points per goal scored.</li>
              <li>+0.2 points per shot on target.</li>
              <li>-0.3 points per shot off target.</li>
            </ul>
          </li>
          <li><strong>Penalties 🚫:</strong>
            <ul>
              <li>-1 point for a yellow card.</li>
              <li>-3 points for a red card.</li>
            </ul>
          </li>
        </ul>
        <p>Additionally, you can earn bonus points:</p>
        <ul>
          <li><strong>Best Team of the Matchday 🥇:</strong> Earn 10 extra points if your team has the best overall performance of the matchday.</li>
          <li><strong>Best Player of the Matchday 🌟:</strong> Earn 10 extra points if you correctly predict the top-performing player of the matchday.</li>
        </ul>
      </section>

      <section id="managing-team" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>5. Managing Your Team 🔄</h2>
        <p>Each matchday, you can adjust your team, making transfers to swap out underperforming players or selecting new star players. Make sure you stay up-to-date with player injuries, suspensions, and form to maximize your points.</p>
      </section>

      <section id="league-rankings" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>6. League Rankings 📈</h2>
        <p>After each matchday, the points are tallied, and a leaderboard is updated. You can view:</p>
        <ul>
          <li><strong>Overall Rankings 🏅:</strong> See how you stack up against other players in your league.</li>
          <li><strong>Matchday Rankings 🏆:</strong> Check out who had the best team for a particular matchday.</li>
        </ul>
      </section>

      <section id="player-club-views" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>7. Player and Club Views 👀</h2>
        <p>Explore the stats of all the players and clubs. You can also ‘like’ your favorite players and clubs, and view your liked items on your profile page. This feature allows you to keep track of players you’re interested in, and see their performance history.</p>
      </section>

      <section id="player-performance" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>8. Player Performance History 📅</h2>
        <p>On your profile page, you can view the historical performance data of players you’ve liked or selected for your team. This data includes match-by-match breakdowns, goals scored, assists, and overall ratings. Use this data to make informed decisions about future transfers and squad selections.</p>
      </section>

      <section id="winning-league" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>9. Winning the League 🥇</h2>
        <p>The season culminates in the crowning of a league champion, the player with the most points. Winning the league is the ultimate goal, so use your football knowledge, strategy, and a bit of luck to outscore your friends and claim victory.</p>
      </section>

      <section id="fair-play" style={{ marginBottom: '30px', textAlign: 'justify' }}>
        <h2>10. Fair Play and Fun 🎯</h2>
        <p>Remember, this game is about having fun and enjoying football. Play fair, and respect the game rules and other players. Good luck, and may the best fantasy manager win!</p>
      </section>

      {/* Back to top */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="#welcome" style={{ color: '#007bff' }}>Back to Top ⬆️</a>
      </div>
    </div>
  );
};

export default GameExplanation;
