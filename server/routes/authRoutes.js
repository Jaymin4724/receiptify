import express from "express";
import {
  login,
  logout,
  signup,
  signupValidation,
  loginValidation,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/logout", logout);

export default router;
