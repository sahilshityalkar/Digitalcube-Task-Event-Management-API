require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB using environment variables
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect from MongoDB after tests are done
  await mongoose.connection.close();
});
