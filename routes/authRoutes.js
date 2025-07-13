const express = require("express");
const { register, login, logout } = require("../controllers/authController");

const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.post("/logout", logout);

module.exports = routes;
