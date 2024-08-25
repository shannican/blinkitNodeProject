// Importing required libraries
const mongoose = require('mongoose');
const Joi = require('joi'); // Make sure to install Joi with npm i joi

// Cart schema using Mongoose
const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }
        ],
        totalPrice: {
            type: Number,
            required: true,
            min: 0 // Ensure the total price is non-negative
        }
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Creating a model from the schema
const cartModel = mongoose.model("Cart", cartSchema);

// Joi validation function for cart data
function validateCart(cart) {
    const schema = Joi.object({
        user: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/), // ObjectId pattern
        products: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required(),
        totalPrice: Joi.number().min(0).required()
    });

    return schema.validate(cart);
}

// Exporting the model and validation function
module.exports = {
    cartModel,
    validateCart
};
