const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  logout,
  getProfile,
  googleCallback,
} = require("../controllers/authController");

const { protectRoutes } = require("../middlewares/authMiddleware");

const routes = express.Router();

// routes for jwt login
routes.post("/register", register);
routes.post("/login", login);
routes.post("/logout", logout);

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

module.exports = routes;
