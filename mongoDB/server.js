const express = require('express');
const userRoutes = require('./api/index');
const app = express();
app.use(express.json());
app.use('/api', userRoutes);
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
