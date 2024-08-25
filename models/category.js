// Importing required libraries
const mongoose = require('mongoose');
const Joi = require('joi'); // Make sure to install Joi with npm i joi

// Category schema using Mongoose
const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
            trim: true // Removes leading and trailing whitespace
        }
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Creating a model from the schema
const categoryModel = mongoose.model("Category", categorySchema);

// Joi validation function for category data
function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });

    return schema.validate(category);
}

// Exporting the model and validation function
module.exports = {
    categoryModel,
    validateCategory
};
