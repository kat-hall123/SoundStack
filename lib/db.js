const mongoose = require('mongoose');

let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.');
  }

  mongoose.set('strictQuery', true);

  connectionPromise = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then((conn) => {
      console.log('> MongoDB connected:', conn.connection.host);
      return conn.connection;
    })
    .catch((err) => {
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
}

module.exports = connectDB;
