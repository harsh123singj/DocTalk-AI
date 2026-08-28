import express from "express";
import { register, login } from "../controllers/authControllers.js";
import passport from "passport";
import generateToken from "../utils/generateToken.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.models.js";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);


// Google OAuth
authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account"
    })
);


// Google OAuth Callback
authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false
    }),
    (req, res) => {

        const token = generateToken(req.user._id);

        res.redirect(
            `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`
        );
    }
);


// Get currently authenticated user
authRouter.get("/me", authMiddleware, async (req, res) => {
    try {

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    authProvider: user.authProvider,
                    avatar: user.avatar,
                    isVerified: user.isVerified
                }
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});


export default authRouter;