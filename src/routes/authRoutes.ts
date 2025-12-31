// const express = require("express");
// const passport = require("passport");
// const {
//   register,
//   login,
//   logout,
//   getProfile,
//   googleCallback,
//   forgetPassword,
//   resetPassword,
// } = require("../controllers/authController");

// const { protectRoutes } = require("../middlewares/authMiddleware");

import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  getProfile,
  googleCallback,
  forgetPassword,
  resetPassword,
} from "../controllers/authController";
import { protectRoutes } from "../middlewares/authMiddleware";

const routes: Router = Router();

// routes for jwt login
routes.post("/register", register);
routes.post("/login", login);
routes.post("/logout", logout);

routes.post("/forgotpassword", forgetPassword);
routes.post("/resetpassword/:token", resetPassword);

routes.get("/profile", protectRoutes, getProfile);

// routes for google login
routes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
routes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "auth/login" }),
  googleCallback
);

// module.exports = routes;

export default routes;
