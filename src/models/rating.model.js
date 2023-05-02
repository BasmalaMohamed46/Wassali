const mongoose = require('mongoose');


const ratingSchema = mongoose.Schema({
    traveler:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Traveler',
        required: true,

    },
    rating: Number,
 
}, {
  timestamps: true,
});


const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
