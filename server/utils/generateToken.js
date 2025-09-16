import jwt from "jsonwebtoken";

const generateToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "6h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // must be true if sameSite=None
    sameSite: "None", // allows cross-origin
    maxAge: 6 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
