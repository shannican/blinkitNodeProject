
const mongoose = require('mongoose');
const Joi = require('joi'); 
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
        type: Number,
        required: true
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 1000
    },
    image: {
        type: Buffer,
        // validate: {
        //     validator: function(v) {
        //         return /^(ftp|http|https):\/\/[^ "]+$/.test(v); // Validate URL format
        //     },
        //     message: props => `${props.value} is not a valid URL!`
        // }
    }
}, { timestamps: true }); 

const productModel = mongoose.model('Product', productSchema);

function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().min(3).max(50).required(),
        stock: Joi.number().required(),
        description: Joi.string().min(10).max(1000).optional(),
        image: Joi.string().uri().optional() // Ensure it's a valid URL
    });

    return schema.validate(product);
}
module.exports = {
    productModel,
    validateProduct
};
