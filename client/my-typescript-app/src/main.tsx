import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './assets/store';

// Créez la racine du DOM où votre application React sera rendue
const rootElement = document.getElementById('root') as HTMLElement;

// Créez un élément racine pour React 18
const root = ReactDOM.createRoot(rootElement);

// Utilisez <React.StrictMode> pour aider à détecter les problèmes potentiels
root.render(
  <React.StrictMode>
    {/* Le Provider de Redux rend le store accessible à toute l'application */}
    <Provider store={store}>
      {/* Le Router permet la gestion de la navigation */}
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
