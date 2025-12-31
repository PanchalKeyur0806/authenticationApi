import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
// routes & controllers
import authRoutes from "./routes/authRoutes";
import { errController } from "./controllers/errController";
import passport from "passport";
import "./config/passport";

require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");

// const authRoutes = require("./routes/authRoutes");
// const { errController } = require("./controllers/errController");
// const passport = require("passport");
require("./config/passport");

const app = express();

app.use(
  session({
    secret: process.env.SESSSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);

// passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// connecting to database
if (process.env.MONGO_URL) {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("ERROR WHILE CONNECTING TO DB ", error);
    });
}

// some middlewares
app.use(express.json());
app.use(cookieParser());

// routing
app.use("/auth", authRoutes);
app.use(errController);

app.listen(process.env.PORT, () => {
  console.log("server is running on port ", process.env.PORT);
});
