import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/ProductModel.js";
import { isAuth, isAdmin, isSellerOrisAdmin } from "../utils.js";

const productRouter = express.Router();

// get all product
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const name = req.query.name || "";
    const seller = req.query.sellerId || "";
    const category = req.query.category || "";
    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;

    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;
    const order = req.query.order || "";

    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : { _id: 1 };

    const count = await Product.countDocuments({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    let products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate("seller")
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.send({
      page,
      pages: Math.ceil(count / pageSize),
      products,
    });
  })
);

// get product by id
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    let productId = req.params.id;
    let product = await Product.findById(productId).populate(
      "seller",
      "seller.name seller.logo seller.description seller.rating seller.numReviews"
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  })
);

productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    await Product.remove({});
    let createdUsers = await Product.insertMany(data.products);
    res.send({ createdUsers });
  })
);

// create product
productRouter.post(
  "/create",
  isAuth,
  isSellerOrisAdmin,
  expressAsyncHandler(async (req, res) => {
    const { name, category, price, countInStock, brand, description, image } =
      req.body;
    let existingProduct = await Product.findOne({ name: name });
    if (existingProduct) {
      res.status(404).send({ message: "Product already exists" });
      return;
    }

    const product = new Product({
      name,
      seller: req.user._id,
      category,
      price,
      countInStock,
      brand,
      description,
      image,
      rating: 0,
      numReviews: 0,
    });

    let createdProduct = await product.save();

    res.status(200).send({
      _id: createdProduct._id,
      name: createdProduct.name,
      category: createdProduct.category,
      price: createdProduct.price,
      countInStock: createdProduct.countInStock,
      brand: createdProduct.brand,
      description: createdProduct.description,
      image: createdProduct.image,
      rating: createdProduct.rating,
      numReviews: createdProduct.numReviews,
      statusCode: 200,
    });
  })
);

// update product
productRouter.put(
  "/update/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let productId = req.params.id;
    const { name, category, price, countInStock, brand, description, image } =
      req.body;

    let product = await Product.findById(productId);

    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }
    if (product) {
      product.name = name ? name : product.name;
      product.category = category ? category : product.category;
      product.price = price ? price : product.price;
      product.countInStock = countInStock ? countInStock : product.countInStock;
      product.brand = brand ? brand : product.brand;
      product.description = description ? description : product.description;
      product.image = image ? image : product.image;
      product.rating = 0;
      product.numReviews = 0;
    }

    let updatedProduct = await product.save();

    res.status(200).send({
      message: "product updated",
      statusCode: 200,
      result: updatedProduct,
    });
  })
);

// delete product
productRouter.delete(
  "/delete/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let productId = req.params.id;
    let product = await Product.findOneAndDelete({ _id: productId });
    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }
    if (product) {
      res.status(200).send({
        message: "product deleted",
        statusCode: 200,
      });
    }
  })
);

// update product
productRouter.put(
  "/:id/review",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let productId = req.params.id;
    const { rating, comment } = req.body;

    let product = await Product.findById(productId);

    if (product) {
      let existingReview = product.reviews.find(
        (review) => review.name === req.user.name
      );
      if (existingReview) {
        res.status(400).send({ message: "User already added review" });
        return;
      }
    }

    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }
    if (product) {
      let review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
    }

    let updatedProduct = await product.save();

    res.status(201).send({
      message: "Review created",
      statusCode: 200,
      result: updatedProduct.reviews[updatedProduct.reviews.length - 1],
    });
  })
);

export default productRouter;
