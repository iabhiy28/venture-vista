const { mkactivity } = require('../app');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apifeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
    next();
}


// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );


// declaring the param for when id is greater then actual 
// exports.checkID = (req,res,next,val)=>{
//     console.log(`Tour id is:${val}`);
//     if(req.params.id*1 > tours.length){
//         return res.status(404).json({
//             status:'fail',
//             message:'Invalid ID'
//         });
//     }
//     next();
// }

// it will check the post route of the user and if name and price are not there middle ware will be called 
// exports.checkBody = (req,res,next)=>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status:'fail',
//             message:'Missing Name or Price'
//         });
//     };
//     next();
// }





exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find() ,req.query).filter().sort().limitFields().paginate();
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



exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
        // console.log(req.params);
    // i have multiplied it just to convert the string into no
    if(!tour){
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'Success',
        data:{
            tour
    }});
});


exports.createTour = catchAsync(async (req, res,next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tours: newTour
        }
    });

});


exports.updateTour = catchAsync(async (req,res, next)=>{
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status:'succes',
        data:{
            tour
        }
    });
});

//
exports.deleteTour = catchAsync(async (req,res, next)=>{
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour){
        return next(next(new AppError('No tour found with that ID', 404)));
    }
    res.status(204).json({
        status:'succes',
        data:null
    });
});

// aggregation pipeline 
exports.getTourStats = catchAsync(async (req, res, next) =>{
    const stats = await Tour.aggregate([
        {
           $match: { ratingsAverage: { $gte: 4.5 }}
        },
        {
           $group: {
               _id:{ $toUpper: '$difficulty' },
               numTours: { $sum: 1},
               numRatings: { $sum: '$ratingsQuantity '},
               avgRating: { $avg: '$ratingsAverage' },
               avgPrice: { $avg: '$price' },
               minPrice: { $min: '$price' },
               maxPrice: { $max: '$price' }, 
           }
        },
        {
           $sort: { avgPrice: 1 }
        }
       //  ,
       //  {
       //     $match: { _id: { $ne: 'EASY' }}
       //  }
   ]);
   res.status(200).json({
       status:'succes',
       data:{
           stats
       }
   });
});

exports.getMonthlyPlan = catchAsync(async ( req, res, next)=>{
    const year = req.params.year*1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTourStarts: { $sum: 1},
                    tours: { $push: '$name'}
                }
            },
            {
                $addFields: { month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1}
            },
            {
                $limit: 12
            }
        ]);
        res.status(200).json({
            status:'success',
            data:{
                plan
            }
        });
});