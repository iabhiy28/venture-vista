const mongoose = require('mongoose');  // Import mongoose
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
