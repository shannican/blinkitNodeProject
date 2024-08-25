// Importing required libraries
const mongoose = require('mongoose');
const Joi = require('joi'); // Make sure to install Joi with npm i joi

// Admin schema using Mongoose
const adminSchema = mongoose.Schema({
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
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'], // Example roles
        required: true
    }
});

// Creating a model from the schema
const adminModel = mongoose.model('Admin', adminSchema);

// Joi validation function for admin data
function validateAdmin(admin) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().valid('admin', 'superadmin').required() // Role validation
    });

    return schema.validate(admin);
}

// Exporting the model and validation function
module.exports = {
    adminModel,
    validateAdmin
};
