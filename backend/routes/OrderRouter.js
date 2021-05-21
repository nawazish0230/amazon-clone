import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { isAdmin, isAuth, isSellerOrisAdmin } from "../utils.js";

const orderRouter = express.Router();

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    // console.log(orders);
    res.send({ orders, users, dailyOrders, productCategories });
  })
);

// create order
orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;
    if (orderItems && orderItems.length === 0) {
      res.status(400).send({ message: "cart is empty" });
      return;
    }
    const order = new Order({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      seller: req.body.orderItems[0].seller,
      user: req.user._id,
    });
    const createdOrder = await order.save();
    res.status(200).send({ message: "Order placed", order: createdOrder });
  })
);

// get all order by particular user
orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

// get all order
orderRouter.get(
  "/",
  isAuth,
  isSellerOrisAdmin,
  expressAsyncHandler(async (req, res) => {
    let seller = req.query.sellerId;
    let sellerFilter = seller ? { seller } : {};
    let orders = await Order.find({ ...sellerFilter })
      .populate("user", "name")
      .populate("seller", "name");
    res.send(orders);
  })
);

// get order by id
orderRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    let orderId = req.params.id;
    let order = await (await Order.findById(orderId)).populated("seller");
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

// update order
orderRouter.put(
  "/:id/pay",
  expressAsyncHandler(async (req, res) => {
    let orderId = req.params.id;
    let order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

// delete order
orderRouter.delete(
  "/delete/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let orderId = req.params.id;
    let order = await Order.findOneAndDelete({ _id: orderId });
    if (!order) {
      res.status(404).send({ message: "Order not found" });
      return;
    }
    if (order) {
      res.status(200).send({
        message: "Order deleted",
        statusCode: 200,
        result: {
          order,
        },
      });
    }
  })
);

// update delivered order
orderRouter.put(
  "/deliver/:id",
  expressAsyncHandler(async (req, res) => {
    let orderId = req.params.id;
    let order = await Order.findById(orderId);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.send({ message: "Order Deliver", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  })
);

// orderRouter.get(
//   "/summary",
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     console.log("entered");
//     // const orders = await Order.aggregate([
//     //   {
//     //     $group: {
//     //       _id: null,
//     //       numOrders: { $sum: 1 },
//     //       totalSales: { $sum: "$totalPrice" },
//     //     },
//     //   },
//     // ]);
//     const users = await User.aggregate([
//       {
//         $group: {
//           _id: null,
//           numberUsers: { $sum: 1 },
//         },
//       },
//     ]);
//     // const dailyOrders = await Order.aggregate([
//     //   {
//     //     $group: {
//     //       _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//     //       orders: { $sum: 1 },
//     //       sales: { $sum: "$totalPrice" },
//     //     },
//     //   },
//     // ]);
//     const productCategories = await Product.aggregate([
//       {
//         $group: {
//           _id: "$category",
//           count: { $sum: 1 },
//         },
//       },
//     ]);
//     // console.log(orders);
//     res.send({ users, productCategories });
//   })
// );

export default orderRouter;
