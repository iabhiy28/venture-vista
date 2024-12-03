const mongoose = require('mongoose');
const { image } = require('qr-image');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // corrected 'require' to 'required'
    unique: true,
    trim: true
  },
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
    required: [true , 'A tour must have difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
    
  },
  price: {
    type: Number,
    required: [true, 'Price must be defined'] // corrected 'require' to 'required'
  },
  discount: Number,
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


  }
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;