const express = require("express");
const router = express.Router();
const { productModel, validateProduct } = require("../models/product");
const { categoryModel } = require("../models/category");
const { cartModel } = require("../models/cart");
const { validateAdmin } = require('../middlewares/admin');
const { customUserLoggedIn } = require('../middlewares/auth'); // Import the middleware
const upload = require('../config/multer');
const mongoose = require("mongoose");
const passport = require("passport");

// Apply customUserLoggedIn middleware to the routes
router.get("/", customUserLoggedIn, async function (req, res) {
  let somethingInCart = false;
  let user = req.user ? req.user.userId : null;
  // let user = req.session.passport || req.user ? (req.session.passport ? req.session.passport.user : req.user): null;
  if (!user) {
    return res.redirect('/users/login');
  }
  const resultArray = await productModel.aggregate([
    {
      $group: {
        _id: "$category",
        products: { $push: "$$ROOT" }
      }
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        products: { $slice: ["$products", 10] }
      }
    }
  ]);
  // let cart = await cartModel.findOne({ user });
  let cart = await cartModel.findOne({ user: new mongoose.Types.ObjectId(user) });
  if (cart && cart.products.length > 0) somethingInCart = true;
  const rnProducts = await productModel.aggregate([{$sample: {size: 3}}]);
  const resultObject = resultArray.reduce((acc, item) => {
    acc[item.category] = item.products;
    return acc;
  }, {});
  res.render("index", {
    products: resultObject,
    rnProducts,
    somethingInCart,
    cartCount: cart ? cart.products.length : 0
  });
});

router.get("/delete/:id", validateAdmin, async function (req, res) {
  if (req.user.admin) {
    await productModel.findOneAndDelete({ _id: req.params.id });
    return res.redirect('/admin/products');
  }
  res.send("You are not allowed to delete this product");
});

router.post("/delete", validateAdmin, async function (req, res) {
  if (req.user.admin) {
    await productModel.findOneAndDelete({ _id: req.body.product_id });
    return res.redirect("back");
  }
  res.send("You are not allowed to delete this product");
});

router.post("/", upload.single('image'), async function (req, res) {
  let { name, price, category, stock, description, image } = req.body;

  let { error } = validateProduct({ name, price, category, stock, description, image });
  if (error) return res.send(error.message);

  // Check if category exists, otherwise create it
  let isCategory = await categoryModel.findOne({ name: category });
  if (!isCategory) {
    await categoryModel.create({ name: category });
  }

  await productModel.create({
    name,
    price,
    category,
    stock,
    description,
    image: req.file.buffer // Save image as binary data
  });

  res.redirect(`/admin/products`);
});

module.exports = router;




