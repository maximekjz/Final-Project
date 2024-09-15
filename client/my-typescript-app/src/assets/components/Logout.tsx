import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/logout', {}, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Supprimer les données stockées localement
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        // Rediriger vers la page de connexion
        navigate('/login');
      }
    } catch (error) {
      console.error('Log out error:', error);
    }
  };

  return (
    <Button variant="contained" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;