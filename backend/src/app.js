import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";

import authRouter from "./routes/authRoutes.js";
import docRouter from "./routes/documentRoutes.js";
import workspaceRouter from "./routes/workspaceRoutes.js";

import "./config/passport.js";

const app = express();



const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests without an origin
            // such as Postman/server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },
        credentials: true,
    })
);



app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(passport.initialize());



app.use("/api/auth", authRouter);

app.use("/api/workspaces", workspaceRouter);

app.use("/api/docs", docRouter);



app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DocTalk AI API is running",
    });
});

export default app;