import { Link } from 'react-router-dom';
import { Button, Stack } from '@mui/material';

const Header: React.FC = () => {
  return (
    <Stack spacing={2} direction={'row'}>
      <Button component={Link} to="/">
        Home
      </Button>
      <Button component={Link} to="/dash">
        Dashboard
      </Button>
      <Button component={Link} to="/data">
        Data
      </Button>
      <Button component={Link} to="/game">
        Game explanation
      </Button>
      <Button component={Link} to="/login">
        Login
      </Button>
      <Button component={Link} to="/register">
        Register
      </Button>
    </Stack>
  );
};

export default Header;
