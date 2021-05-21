import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    process.env.JWT_SECRET || "semething secret",
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    let token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || "semething secret",
      (err, decode) => {
        if (err) {
          return res.status(401).send({ message: "Invalid token" });
        }
        req.user = decode;
        next();
      }
    );
    return;
  }
  return res.status(401).send({ message: "token doesnt exists" });
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
    return;
  }
  return res.status(401).send({ message: "Invalid Admin token" });
};

export const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
    return;
  }
  return res.status(401).send({ message: "Invalid Seller token" });
};

export const isSellerOrisAdmin = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) {
    next();
    return;
  }
  return res.status(401).send({ message: "Invalid Admin/Seller token" });
};
