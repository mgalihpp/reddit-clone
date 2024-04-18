import express from "express";
import session from "express-session";
import path from "path";
import dotenv from "dotenv";
import indexRouter from "@routes/index-routes";
import userRouter from "@routes/auth-routes";
import { errorHandler } from "@middlewares/error-handlers";
import { authenticatedToken } from "@middlewares/authenticated-token";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/protected", authenticatedToken, (req, res) => {
  res.send(req.user);
});
app.use("/users", userRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
