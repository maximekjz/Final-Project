import express from 'express';

const app = express();

app.get('/api/test', (req, res) => {
  res.status(200).send('Test route is working');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});