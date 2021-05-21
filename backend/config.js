import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  MONGODB_URL: process.env.MONGODB_URL || "",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  accessKeyId: process.env.accessKeyId || "",
  secretAccessKey: process.env.secretAccessKey || "",
};
