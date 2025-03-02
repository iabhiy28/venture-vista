const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');



exports.getAllUser = catchAsync(async (req,res , next)=>{
    const users = await User.find();
        // send response
        res.status(200).json({
            status: 'Success',
            result: users.length,
            data: {
                users
            }
        });
});

exports.createUser =catchAsync(async  (req,res)=>{
    const tours = await features.query;
        // send response
        res.status(200).json({
            status: 'Success',
            result: tours.length,
            data: {
                tours
            }
        });
});

exports.getUser = catchAsync( async (req,res)=>{
    const tours = await features.query;
        // send response
        res.status(200).json({
            status: 'Success',
            result: tours.length,
            data: {
                tours
            }
        });
});

exports.updateUser = catchAsync(async (req,res)=>{
    const tours = await features.query;
        // send response
        res.status(200).json({
            status: 'Success',
            result: tours.length,
            data: {
                tours
            }
        });
});

exports.deleteUser = catchAsync(async  (req,res)=>{
    const tours = await features.query;
        // send response
        res.status(200).json({
            status: 'Success',
            result: tours.length,
            data: {
                tours
            }
        });
});