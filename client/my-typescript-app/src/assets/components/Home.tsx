import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:5000/user/all', {
        headers: {
          "x-access-token": "token",
        },
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  return (
    <>
      <h2>Home</h2>
      {users.map((item) => (
        <div key={item.id}>
          {item.id} {item.email}
        </div>
      ))}
    </>
  );
};

export default Home;
