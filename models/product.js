// Importing required libraries
const mongoose = require('mongoose');
const Joi = require('joi'); // Make sure to install Joi with npm i joi

// Product schema using Mongoose
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Ensure the price is non-negative
    },
    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    stock: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 1000
    },
    image: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v); // Validate URL format
            },
            message: props => `${props.value} is not a valid URL!`
        }
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Creating a model from the schema
const productModel = mongoose.model('Product', productSchema);

// Joi validation function for product data
function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().min(3).max(50).required(),
        stock: Joi.boolean().required(),
        description: Joi.string().min(10).max(1000),
        image: Joi.string().uri() // Ensure it's a valid URL
    });

    return schema.validate(product);
}

// Exporting the model and validation function
module.exports = {
    productModel,
    validateProduct
};
