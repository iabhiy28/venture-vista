const mongoose = require('mongoose');  // Import mongoose
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// now catch the uncaught exception
process.on('uncaughtException', err => {
  console.log(`UNCAUGHT EXCEPTION! 💥 Shutting down...`);
  console.log(err.name, err.message);
    process.exit(1);
});


mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, // Option to avoid deprecation warning
  useFindAndModify: false // Option to avoid deprecation warning
}).then(() => {
  console.log('DB connection successful!');
}).catch((err) => {
  console.error('DB connection error:', err);
});


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
// testing the debugger


process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    server.close(() => {
      process.exit(1);
    });
});
