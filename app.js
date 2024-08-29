const express = require("express");
const axios = require('axios');
const userRouter = require("./routes/userRouter.js");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

// Configure CORS to allow requests from your client
app.use(cors({
  origin: 'http://localhost:5173', // Assurez-vous que cela correspond au port de votre client
  credentials: true
}));

// Route pour les API de SportMonks
app.get('/api/v3/football/:endpoint', async (req, res) => {
  try {
    const apiToken = process.env.SPORTMONKS_API_TOKEN; // Utilisation d'une variable d'environnement
    const { endpoint } = req.params;
    const response = await axios.get(`https://api.sportmonks.com/v3/football/${endpoint}`, {
      params: { api_token: apiToken },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from SportMonks API:', error);
    res.status(500).send('Error fetching data from SportMonks API');
  }
});

// Utilisation des routes utilisateur
app.use("/user", userRouter);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
