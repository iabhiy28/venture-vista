const AppError = require('../utils/appError');


const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);

}

/// dubFunction Called 
const handleDbDublicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; // this is the value that is dublicated
  const message = `Dublicate field value: ${value}, Please use another value`
  return new AppError(message, 400);
}


const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}



const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}



const sendErrorProd = (err, res) =>{
  // operational, trusted error: send message to client
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // programming or other unknown error: don't leak error details
  else{
    // 1) log error
    console.error('Error 💥', err);

    // 2) send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
}




/// handling the different kinds of error caused during development and production of the application


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';


  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err, res);
  }
  else if(process.env.NODE_ENV=== 'production') {
    let error = {...err};
    if(error.name === "CastError") error = handleCastErrorDB(error);

    // handle the error caused by the dublication of the fields
    if(error.code===11000) error = handleDbDublicateFieldsDB(error);



    if(error.name === "ValidationError") error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  } 
};