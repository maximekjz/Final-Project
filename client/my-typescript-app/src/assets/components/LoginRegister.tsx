import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
import {saveToLocalStorage} from '../../../storageUtil'

interface LoginRegisterProps {
  title: string;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ title }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');  
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>(''); 
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  const loginregister = async () => {
    try {
      if (title === 'Login') {
        const response = await axios.post('http://localhost:3000/user/login', {
          email,
          password,
        }, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setMessage(response.data.message);

          const { token, user } = response.data;
          saveToLocalStorage('token', token);
          saveToLocalStorage('userId',user.id); 
          console.log('Token stocké:', token);
          console.log('User ID stocké:', user.id);

          console.log(response.data);
          navigate('/');
        };
      } else {
        const response = await axios.post('http://localhost:3000/user/register', {
          email,
          password,
          username,
          first_name: firstName,
          last_name: lastName
        }, {
          withCredentials: true,
        });

        if (response.status === 201 || response.status === 200) {
          setMessage(response.data.message);
          console.log(response.data);
          navigate('/login');
        }
      }
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.status === 409) {
        setMessage(error.response.data.error);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  
  return (
    <>
      <h2>{title}</h2>
      <Box component={"form"} sx={{ m: 1 }} noValidate autoComplete="off">
        <TextField
          sx={{ m: 1 }}
          id="email"
          type="email"
          label="Enter your email"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          sx={{ m: 1 }}
          id="password"
          type="password"
          label="Enter your password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
        {title === 'Register' && (  // Afficher ces champs uniquement si le titre est 'Register'
          <>
            <TextField
              sx={{ m: 1 }}
              id="username"
              type="text"
              label="Enter your username"
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              sx={{ m: 1 }}
              id="firstName"
              type="text"
              label="Enter your first name"
              variant="outlined"
              onChange={(e) => setFirstName(e.target.value)}
            />

            <TextField
              sx={{ m: 1 }}
              id="lastName"
              type="text"
              label="Enter your last name"
              variant="outlined"
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}
      </Box>
      <Button variant="contained" onClick={loginregister}>
        {title}
      </Button>
      <div>{message}</div>
    </>
  );
};

export default LoginRegister;