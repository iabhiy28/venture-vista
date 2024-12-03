const express = require('express');

const app = express();

const fs = require('fs');

const { get } = require('http');

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Declaration of middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

// creating the custom middleware
app.use((req, res, next) => {
  console.log(`Middleware Called`);
  next();
});
app.use((req, res, next) => {
  req.requstTime = new Date().toISOString();
  next();
});
// third party middleware

//////////////////////////

// GET route
// app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour);
// app.post('/api/v1/tours',createTour);
// implementing PATCH Request(Display only the changed parametere)
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',delteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
