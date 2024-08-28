import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';

interface LoginRegisterProps {
  title: string;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ title }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  const loginregister = async () => {
    try {
      if (title === 'Login') {
        const response = await axios.post('http://localhost:5000/user/login', {
          email,
          password,
        }, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setMessage(response.data.message);
          console.log(response.data);
          navigate('/');
        }
      } else {
        const response = await axios.post('http://localhost:5000/user/register', {
          email,
          password,
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
      setMessage(error.response.data.message);
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
      </Box>
      <Button variant="contained" onClick={loginregister}>
        {title}
      </Button>
      <div>{message}</div>
    </>
  );
};

export default LoginRegister;
