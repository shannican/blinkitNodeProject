// Importing the required libraries
const mongoose = require('mongoose');
const Joi = require('joi');

// Address schema using Mongoose
const addressSchema = mongoose.Schema({
    state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    zip: {
        type: Number,
        required: true,
        min: 10000,
        max: 99999
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
});

// User schema using Mongoose
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/
        },
        password: {
            type: String,
            minlength: 8
        },
        phone: {
            type: Number,
            match: /^\d{10}$/
        },
        address: [addressSchema]
    },
    { timestamps: true }
);

// Creating a model from the schema
const userModel = mongoose.model("User", userSchema);

// Joi validation function for user data
function validateUser(user) {
    const addressValidationSchema = Joi.object({
        state: Joi.string().min(2).max(100).required(),
        zip: Joi.number().min(10000).max(99999).required(),
        city: Joi.string().min(2).max(100).required(),
        address: Joi.string().min(5).max(255).required()
    });

    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        phone: Joi.string().pattern(/^\d{10}$/).required(),
        address: Joi.array().items(addressValidationSchema)
    });

    return schema.validate(user);
}

// Exporting the model and validation function
module.exports = { userModel, validateUser};
