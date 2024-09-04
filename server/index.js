const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db')
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(express.json());
app.use(cors());

//connection to MongoDB
connectDB();

// Define a sample route
app.get('/', (req, res) => {
    res.send('API is running...');
  });

// routes
app.use('/api', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});