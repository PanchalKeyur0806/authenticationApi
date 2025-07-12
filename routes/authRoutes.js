const express = require("express");
const { register } = require("../controllers/authController");

const routes = express.Router();

routes.post("/register", register);

module.exports = routes;
