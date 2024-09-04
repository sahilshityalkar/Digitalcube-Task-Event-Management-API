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

// Mounts the event routes under the '/api' prefix
app.use('/api', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});