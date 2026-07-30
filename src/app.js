import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.middleware.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
// import mongoSanitize from "express-mongo-sanitize";


const app = express();
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(helmet());

app.use(compression());

// app.use(mongoSanitize());
const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 5,

    message: "Too many login attempts"

});
app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        message: "ERP API Running"

    });

});
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);
export default app;