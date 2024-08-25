// Importing required libraries
const mongoose = require('mongoose');
const Joi = require('joi'); // Make sure to install Joi with npm i joi

// Order schema using Mongoose
const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0 // Ensure the total price is non-negative
    },
    address: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'shipped', 'cancelled'], // Example statuses
        required: true
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery',
        required: true
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Creating a model from the schema
const orderModel = mongoose.model('Order', orderSchema);

// Joi validation function for order data
function validateOrder(order) {
    const schema = Joi.object({
        user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // ObjectId pattern
        products: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required(),
        totalPrice: Joi.number().min(0).required(),
        address: Joi.string().min(10).max(255).required(),
        status: Joi.string().valid('pending', 'completed', 'shipped', 'cancelled').required(), // Only allow predefined statuses
        payment: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        delivery: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    });

    return schema.validate(order);
}

// Exporting the model and validation function
module.exports = {
    orderModel,
    validateOrder
};
