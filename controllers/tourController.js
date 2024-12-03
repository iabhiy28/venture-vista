const { mkactivity } = require('../app');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apifeatures');

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





exports.getAllTours = async (req, res) => {
    try {
        // EXICUTE QUERY
        const features = new APIFeatures(Tour.find() ,req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;

        res.status(200).json({
            status: 'Success',
            result: tours.length,
            data: {
                tours
            }
        });
        // console.log(req.query);
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};



exports.getTour = async (req, res) => {
    try{
        const tour = await Tour.findById(req.params.id);
        // console.log(req.params);
    // i have multiplied it just to convert the string into no
        res.status(200).json({
            status: 'Success',
            data:{
                tour
        }});
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};


exports.createTour = async (req, res) => {
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
        status: 'success',
        data: {
            tours: newTour
        }
    });   
    }catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    } 
}


exports.updateTour = async (req,res)=>{
    try{
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
    }catch(err){
        res.status(401).json({
            status: 'fail',
            message: err
        });
    }
};

//
exports.deleteTour = async (req,res)=>{
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status:'succes',
            data:null
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

// aggregation pipeline 
exports.getTourStats = async (req, res) =>{
    try{
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
    }catch( err ){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getMonthlyPlan = async ( req, res )=>{
    try {
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
    }catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}