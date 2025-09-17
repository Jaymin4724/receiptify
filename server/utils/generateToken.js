import jwt from "jsonwebtoken";

const generateToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "6h",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 6 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
