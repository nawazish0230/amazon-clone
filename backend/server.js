import express from "express";
import mongoose from "mongoose";
import data from "./data.js";
import path from "path";
import productRouter from "./routes/ProductRouter.js";
import userRouter from "./routes/UserRouter.js";
import orderRouter from "./routes/OrderRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import categoryRouter from "./routes/CategoryRouter.js";
import config from "./config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("server is ready");
});

// app.get("/api/products", (req, res) => {
//   res.send(data.products);
// });

// app.get("/api/product/:id", (req, res) => {
//   let product = data.products.find((item) => item._id === req.params.id);
//   if (product) {
//     return res.send(product);
//   }
//   res.status(404).send({ message: "Product not found" });
// });

app.use("/api/uploads", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/config/paypal", (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID || "sb");
});
app.use("/api/config/google", (req, res) => {
  res.send(config.GOOGLE_API_KEY || "");
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use((err, req, res, next) => {
  res.status(400).send({ message: err.message, statusCode: 400 });
});

app.use(express.static("frontend/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

app.listen(config.port, () => {
  console.log("server started at " + config.port);
});
