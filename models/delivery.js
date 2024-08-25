// Importing required libraries
const mongoose = require('mongoose');
const Joi = require('joi'); // Make sure to install Joi with npm i joi

// Delivery schema using Mongoose
const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    deliveryboy: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    status: {
        type: String,
        enum: ["pending", "in transit", "delivered"], // Example statuses
        required: true
    },
    trackingURL: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        },
        required: true
    },
    estimatedDeliveryTime: {
        type: Number,
        required: true,
        min: 0 // Ensure the estimated delivery time is non-negative
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Creating a model from the schema
const deliveryModel = mongoose.model("Delivery", deliverySchema);

// Joi validation function for delivery data
function validateDelivery(delivery) {
    const schema = Joi.object({
        order: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // ObjectId pattern
        deliveryboy: Joi.string().min(3).max(100).required(),
        status: Joi.string().valid("pending", "in transit", "delivered").required(), // Only allow predefined statuses
        trackingURL: Joi.string().uri().required(), // Ensure it's a valid URL
        estimatedDeliveryTime: Joi.number().min(0).required()
    });

    return schema.validate(delivery);
}

// Exporting the model and validation function
module.exports = {
    deliveryModel,
    validateDelivery
};
