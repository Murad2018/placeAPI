
var mongoose = require('mongoose');
var Schema = mongoose.Schema

var ratingSchema = new Schema({
    name: String,
    rating: Number,
    review: String
});

var PlaceSchema = new Schema({
        name: String,
        description: String,
        country: String,
        categories:[],        
        createdAt:{type: Date, default: Date.now},
        reviews: [ratingSchema] //adding new document by creating new schema
    });

module.exports = mongoose.model('Place', PlaceSchema);