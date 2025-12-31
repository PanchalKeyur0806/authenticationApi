// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;

// const User = require("../models/userModel");
// const AppError = require("../utils/AppError");
// const catchAsync = require("../utils/catchAsync");

import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/userModel";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.CALLBACK_URL
) {
  throw new Error("Google OAuth environment variables are not defined");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // try catch block for error handling
      try {
        let user = await User.findOne({ googleId: profile.id });

        const emails = profile.emails;

        if (!emails || emails.length === 0) {
          return done(
            new AppError("No email associated with this Google account", 400)
          );
        }
        const firstEmail = emails[0];

        if (!firstEmail || !firstEmail.value) {
          return done(
            new AppError("No email associated with this Google account", 400)
          );
        }

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: firstEmail.value,
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  if ("id" in user) {
    done(null, user.id);
  } else {
    done(new Error("User object does not have an id property"), null);
  }
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
