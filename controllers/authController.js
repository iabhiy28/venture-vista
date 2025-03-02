const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if the user exists & password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything is OK, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
});



exports.protect = catchAsync(async (req,res,next)=>{
    // 1) Getting token and check if its there 
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[2];
    }
    console.log(token);

    if(!token) {
        return next(new AppError('You are not logged in! PLease log in to get access.', 401));
    }
    // 2) Varification token


    //3) Check if use still exists


    // 4) check if user changed password after the toke was issued 

    next();
})
