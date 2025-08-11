// config/db.js
const mongoose = require('mongoose');
const logToService = require('../modules/log/utils/logToService'); 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected!');
    await logToService('AUTH', 'INFO', 'MongoDB Connected Successfully');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    await logToService('AUTH', 'ERROR', 'MongoDB Connection Failed', { error: err.message });
    process.exit(1);
  }
};

module.exports = connectDB;
