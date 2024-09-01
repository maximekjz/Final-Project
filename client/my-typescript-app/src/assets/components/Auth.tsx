import { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import LoginRegister from "./LoginRegister";
import React from "react";

interface AuthProps {
  children: ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const [redirect, setRedirect] = useState<boolean>(false);

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/auth', {
        headers: {
          'x-access-token': 'token',
        },
        withCredentials: true,
      });
      if (response.status === 201) setRedirect(true);
    } catch (error) {
      setRedirect(false);
    }
  };

  return redirect ? children : <LoginRegister title="Login" />;
};

export default Auth;
