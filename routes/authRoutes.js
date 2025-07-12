const express = require("express");
const { register } = require("../controllers/authController");

const routes = express.Router();

routes.get("/", register);

module.exports = routes;
