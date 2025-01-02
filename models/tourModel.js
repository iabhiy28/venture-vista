const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // corrected 'require' to 'required'
    unique: true,
    trim: true,
    maxlength: [40, 'A Tour must have less or equal then 40 character.'],
    minlength: [10, 'A Tour name must have more or equal then 10 characters']
  // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have duration!!']
  },
  maxGroupSize: {
    type: Number,
    required: [true,'Tour must have a group size.']
  },
  difficulty: {
    type: String,
    required: [true , 'A tour must have difficulty'],
    enum:{
      values: ['easy','medium','difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
    
  },
  price: {
    type: Number,
    required: [true, 'Price must be defined'] // corrected 'require' to 'required'
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val){
        // this only points to corrent doc on new document creation 
        return val < this.price; // 100 < 200
      },
      message: 'Discount price ({VALUE}) should below the regular price'
    }
  },
  summary: {
    type: String,
    required: [true, 'A tour must have description.'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image.']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: {
    type: [Date],
  },
  secretTour: {
    type: Boolean,
    default: false
  }
},
  {
  toJSON: { virtuals: true},
  toObject: { virtuals: true}
});
// defining the virtual property to our schema
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE , runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true});
  next();
})

// tourSchema.pre('save', function(next) {
//   console.log("Will save the document...");
//   next();
// })

// tourSchema.post('save' , function(doc ,next){
//   console.log(doc);
//   next();
// });
// QUERY MIDDLEWARE 
// all the words that starts with find 
tourSchema.pre(/^find/, function(next){
  this.find({ secretTour : {$ne: true }});

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next){
  console.log(`Query took ${Date.now() - this.start} millisecond!`);
  console.log(docs);

});

// AGGRIGATION MIDDLEWARE 
tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({ $match: {secretTour: { $ne: true }} })
  console.log(this.pipeline());
  next();
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;