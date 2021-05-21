import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";

const uploadRouter = express.Router();

const multerStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage: multerStorage });

uploadRouter.post(
  "/",
  isAuth,
  upload.single("image"),
  expressAsyncHandler((req, res) => {
    res.send(`/${req.file.path}`);
  })
);

aws.config.update({
  accessKeyId: "AKIATODRZHQ3G526Z4HX",
  secretAccessKey: "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",
});

const s3 = new aws.S3();
const storageS3 = multerS3({
  s3,
  bucket: "amazonnss-bucket",
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadS3 = multer({ storage: storageS3 });
uploadRouter.post(
  "/s3",
  isAuth,
  uploadS3.single("image"),
  expressAsyncHandler((req, res) => {
    res.send(req.file.location);
  })
);

export default uploadRouter;
