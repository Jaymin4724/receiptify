import jwt from "jsonwebtoken";

const generateToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "6h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only secure in production
    sameSite: "strict",
    maxAge: 6 * 60 * 60 * 1000, // 6 hours
  });

  return token;
};

export default generateToken;
