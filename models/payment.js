// Importing required libraries
const mongoose = require('mongoose');
const Joi = require('joi'); // Make sure to install Joi with npm i joi

// Payment schema using Mongoose
const paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0 // Ensure the amount is non-negative
    },
    method: {
        type: String,
        enum: ['credit card', 'paypal', 'bank transfer', 'cash on delivery'], // Example methods
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'], // Example statuses
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true, // Ensure transaction IDs are unique
        minlength: 5,
        maxlength: 255
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Creating a model from the schema
const paymentModel = mongoose.model('Payment', paymentSchema);

// Joi validation function for payment data
function validatePayment(payment) {
    const schema = Joi.object({
        order: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // ObjectId pattern
        amount: Joi.number().min(0).required(),
        method: Joi.string().valid('credit card', 'paypal', 'bank transfer', 'cash on delivery').required(), // Only allow predefined methods
        status: Joi.string().valid('pending', 'completed', 'failed', 'refunded').required(), // Only allow predefined statuses
        transactionId: Joi.string().min(5).max(255).required() // Transaction ID constraints
    });

    return schema.validate(payment);
}

// Exporting the model and validation function
module.exports = {
    paymentModel,
    validatePayment
};
