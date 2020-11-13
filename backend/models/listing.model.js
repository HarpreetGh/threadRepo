const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    username: { // The user who listed it (ref User model)
        type: String, //Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { // Name of the listing
        type: String,
        required: true,
        trim: true,
        maxlength: 75
    },
    description: { // Text description of listing
        type: String,
        required: true,
        trim: true,
        maxlength: 400
    },
    category: {  // The price of the listing
        type: String,
        required: true,
        trim: true
    },
    size: { // The size of the listing 
        type: String,
        required: true,
        trim: true
    },
    color: { // The color of the listing
        type: String,
        required: true,
        trim: true
    },
    condition: { // The condition of the listing
        type: String,
        required: true,
        trim: true
    },
    price: {  // The price of the listing
        type: Number, 
        required: true,
        min: 0,
        default: 0,
        max: 100000
    },
    likes: {  // The price of the listing
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    sold: {  // The price of the listing
        type: Boolean,
        required: true,
        default: false
    },
    image : {  //url of image
        type: String,
        required: true,
    },
    comments: [{
        text: String,
        postedBy: String
    }]

},  {
    timestamps: true,
})

const Listing = mongoose.model(`Listing`, listingSchema);

module.exports = Listing;