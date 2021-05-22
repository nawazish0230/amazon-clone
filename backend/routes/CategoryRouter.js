import express from "express";
import expressAsyncHandler from "express-async-handler";
import Category from "../models/CategoryModel.js";
import { isAdmin, isAuth } from "../utils.js";

const categoryRouter = express.Router();

// get all category
categoryRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    let products = await Category.find();
    res.send(products);
  })
);

// create category
categoryRouter.post(
  "/create",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { name, description } = req.body;

    let existingProduct = await Category.findOne({ name: name });
    if (existingProduct) {
      res.status(404).send({ message: "Category already exists" });
      return;
    }

    const category = new Category({
      name,
      description,
    });

    let createdCategory = await category.save();

    res.status(200).send({
      statusCode: 200,
      result: {
        _id: createdCategory._id,
        name: createdCategory.name,
        description: createdCategory.description,
      },
    });
  })
);

// get category by id
categoryRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    let categoryId = req.params.id;
    let category = await Category.findById(categoryId);
    if (category) {
      res.send(category);
    } else {
      res.status(404).send({ message: "Category not found" });
    }
  })
);

// update category
categoryRouter.put(
  "/update/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let categoryId = req.params.id;
    const { name, description } = req.body;

    let category = await Category.findById(categoryId);

    if (!category) {
      res.status(404).send({ message: "category not found" });
      return;
    }
    if (category) {
      category.name = name ? name : category.name;
      category.description = description ? description : category.description;
    }

    let updatedProduct = await category.save();

    res.status(200).send({
      message: "category updated",
      statusCode: 200,
      result: updatedProduct,
    });
  })
);

export default categoryRouter;
