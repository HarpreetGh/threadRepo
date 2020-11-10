
//Helps us connect to database 
const mongoose = require('mongoose');  

const Schema = mongoose.Schema;

//This is basically an object we created for user
const userSchema = new Schema({        

        username: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            required: [true, "Can not be blank"],
            minlength : [3, "Name is too short!"],
            maxlength: 15,
            index: true

        },

        firstname: {
            type: String,
            required: true,
            trim: true
        },

        lastname: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, "Can not be blank"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'is invalid']
        },
        
        history: {
            type: Array,
            default: []
        },

        wishlist: {
            type: Array,
            default: [""]
        },

        password: {
            type: String,
            required: true,
            minlength: [8, "Password too short!" ],
        },

}, {
        timestamps: true,
})


const User = mongoose.model('User', userSchema);

module.exports = User;

