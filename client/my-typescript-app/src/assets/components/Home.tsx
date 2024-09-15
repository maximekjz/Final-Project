import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={headerTitleStyle}>⚽ Welcome to Fantasy Football League ⚽</h1>
        <p style={headerSubtitleStyle}>Your ultimate platform to test your football skills and compete with friends!</p>
      </header>

      <nav style={navStyle}>
        <h2>Explore the League</h2>
        <ul style={navListStyle}>
          <li><Link to="/data" style={navLinkStyle}>🔍 Data: Player and Club Stats</Link></li>
          <li><Link to="/league" style={navLinkStyle}>🏆 My League: Create/Join Leagues and Check Rankings</Link></li>
          <li><Link to="/team" style={navLinkStyle}>⚽ My Team: Build and Manage Your Dream Team</Link></li>
        </ul>
      </nav>

      <section style={sectionStyle}>
        <h2>How to Get Started</h2>
        <p>Follow these steps to dive into the excitement of fantasy football:</p>
        <ul style={listStyle}>
          <li>Create your account and join or create a league.</li>
          <li>Select your team of real-life football players.</li>
          <li>Score points based on your players' performances in actual matches.</li>
          <li>Monitor your league standings and make strategic changes to climb the rankings.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2>Game Rules</h2><Link to="/game">🔍 Click here !</Link>
        <p>Here’s a brief overview of how the game works:</p>
        <ul style={listStyle}>
          <li><strong>Team Selection:</strong> Choose 1 Goalkeeper, 1 Defender, 1 Midfielder, and 2 Forwards from the supported leagues.</li>
          <li><strong>Point System:</strong> Earn points based on your players' real-life performances. The more goals, saves, and assists, the higher your score!</li>
          <li><strong>Manage Your Team:</strong> Adjust your team lineup each matchday to optimize your points.</li>
          <li><strong>Win the League:</strong> The player with the highest points at the end of the season wins the league!</li>
        </ul>
      </section>

      <footer style={footerStyle}>
        <p>&copy; 2024 Fantasy Football League. All rights reserved.</p>
        <p><a href="#top" style={footerLinkStyle}>Back to Top ⬆️</a></p>
      </footer>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f4f4f4',
  textAlign: 'center',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '40px',
  padding: '20px',
};

const headerTitleStyle: React.CSSProperties = {
  fontSize: '3em',
};

const headerSubtitleStyle: React.CSSProperties = {
  fontSize: '1.5em',
};

const navStyle: React.CSSProperties = {
  marginBottom: '30px',
};

const navListStyle: React.CSSProperties = {
  listStyleType: 'none',
  padding: 0,
};

const navLinkStyle: React.CSSProperties = {
  display: 'block',
  padding: '10px',
  backgroundColor: '#ffffff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  textDecoration: 'none',
  color: '#007bff',
  margin: '10px 0',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '30px',
  textAlign: 'justify',
};

const listStyle: React.CSSProperties = {
  listStyleType: 'none',
  padding: 0,
};

const footerStyle: React.CSSProperties = {
  padding: '20px',
  color: '#fff',
  marginTop: '40px',
};

const footerLinkStyle: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
};

export default HomePage;
