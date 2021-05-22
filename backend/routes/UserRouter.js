import express from "express";
import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import User from "../models/UserModel.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    await User.remove({});
    let createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user.isBlocked) {
      return res.status(400).send({ message: "User blocked" });
    }
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        return res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(user),
        });
      }
      return res.status(400).send({ message: "Invalid user credentials" });
    }
    return res.status(404).send({ message: "User not found" });
  })
);

// register user
userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(404).send({ message: "User already exists" });
      return;
    }

    const user = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
    });

    let registerUser = await user.save();

    res.send({
      _id: registerUser._id,
      email: registerUser.email,
      name: registerUser.name,
      isAdmin: registerUser.isAdmin,
      token: generateToken(registerUser),
    });
  })
);

// get users
userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let user = await User.find();
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

// get user details
userRouter.get(
  "/get-user-detail/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let userId = req.params.id;
    let user = await User.findById(userId).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

// update user profile
userRouter.post(
  "/profile/:id",
  expressAsyncHandler(async (req, res) => {
    let userId = req.params.id;
    let user = await User.findById(userId);

    if (user.isSeller) {
      user.seller.name = req.body.sellerName || user.seller.name;
      user.seller.logo = req.body.sellerLogo || user.seller.logo;
      user.seller.description =
        req.body.sellerDescription || user.seller.description;
    }

    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      let updatedUser = await user.save();

      res.send({
        _id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        sellerName: updatedUser.seller.name,
        sellerLogo: updatedUser.seller.logo,
        sellerDescription: updatedUser.seller.description,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

// block user
userRouter.put(
  "/block-unblock/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let userId = req.params.id;
    let user = await User.findById(userId).select("-password");

    if (user.isAdmin) {
      res
        .status(400)
        .send({ message: "You cant block admin", statusCode: 400 });
    }

    const blocked = req.body.isBlocked;
    if (user) {
      user.isBlocked = blocked;
      const updatedUser = await user.save();
      res.send({
        statusCode: 200,
        message: `User ${blocked ? "blocked" : "UnBlocked"}`,
        user: updatedUser,
      });
    } else {
      res.status(404).send({ message: "User not found", statusCode: 404 });
    }
  })
);

// update user
userRouter.put(
  "/update/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let userId = req.params.id;
    const { name, email, seller, admin, blocked } = req.body;

    let user = await User.findById(userId);

    if (!user) {
      res.status(404).send({ message: "User not found", statusCode: 404 });
      return;
    }

    if (user) {
      user.name = name ? name : user.name;
      user.email = email ? email : user.email;
      user.isSeller = seller;
      user.isAdmin = Boolean(admin);
      user.isBlocked = Boolean(blocked);
    }

    let updatedUser = await user.save();

    res.status(200).send({
      message: "User updated",
      statusCode: 200,
      result: updatedUser,
    });
  })
);

// get top seller
userRouter.get(
  "/top-sellers",
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .select("seller")
      .sort({ "seller.rating": -1 })
      .limit(3);
    res.send(topSellers);
  })
);

export default userRouter;
