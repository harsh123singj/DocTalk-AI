import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.models.js"
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            // we'll implement this next
            const googleId = profile.id;
            const name = profile.displayName;
            const email = profile.emails[0].value.trim().toLowerCase();
            const avatar = profile.photos?.[0]?.value;

            const findUserByGoogleId = await User.findOne({ googleId })
            if (findUserByGoogleId) {
                return done(null, findUserByGoogleId);
            }

            const existingUserByEmail = await User.findOne({ email })

            if (existingUserByEmail) {
                existingUserByEmail.googleId = googleId;
                existingUserByEmail.avatar = avatar;
                await existingUserByEmail.save();
                return done(null, existingUserByEmail);
            }


            const createUser = new User({
                name,
                email,
                googleId,
                avatar,
                authProvider: "google",
                isVerified: true
            })

            const savedUser = await createUser.save();
            return done(null, savedUser);
        }
    )
);