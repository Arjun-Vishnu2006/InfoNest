const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    const server = app.listen(
      PORT,
      () => {
        console.log(
          `InfoNest API running in ${
            process.env.NODE_ENV ||
            'development'
          } mode on port ${PORT}`
        );
      }
    );

    // Handle unhandled Promise rejections
    process.on(
      'unhandledRejection',
      (err) => {
        console.error(
          `Unhandled rejection: ${err.message}`
        );

        server.close(() => {
          process.exit(1);
        });
      }
    );

    // Handle uncaught exceptions
    process.on(
      'uncaughtException',
      (err) => {
        console.error(
          `Uncaught exception: ${err.message}`
        );

        server.close(() => {
          process.exit(1);
        });
      }
    );
  } catch (error) {
    console.error(
      `Server startup failed: ${error.message}`
    );

    process.exit(1);
  }
};

start();