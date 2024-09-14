import { useEffect, useState, ReactNode, useContext } from "react";
import axios from "axios";
import LoginRegister from "./LoginRegister";
import React from "react";

interface AuthProps {
  children: ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const [redirect, setRedirect] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      const token = localStorage.getItem('token'); 
      console.log('Token récupéré du localStorage:', token); // Ajoutez ce log

      if (!token) {
        console.log('Aucun token trouvé, redirection vers login');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/user/auth', {
        headers: {
          'x-access-token': 'token',
        },
        withCredentials: true,
      });
      if (response.status === 201) {
        console.log('Authentification réussie');
        setIsAuthenticated(true);
      } else {
        console.log('Authentification échouée');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur de vérification:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? children : <LoginRegister title="Login" />;
};

export default Auth;
