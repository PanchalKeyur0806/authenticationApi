require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();

// connecting to database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("ERROR WHILE CONNECTING TO DB ", error);
  });

// some middlewares
app.use(express.json());
app.use(cookieParser());

// routing
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("server is running on port ", process.env.PORT);
});
