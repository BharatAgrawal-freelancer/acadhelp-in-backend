import express from "express";
import dotenv from "dotenv";
dotenv.config();
import session from "express-session"; // <-- changed here
import passport from "passport";

import connectDB from "./config/db.js";
import corsConfig from "./middleware/cors.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passport.js";
import geminiRoute from "./routes/geminiRoute.js";
import studentRoutes from "./routes/studentRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import examBatchRoutes from "./routes/examBatchRoutes.js";


const app = express();
const PORT = process.env.PORT;
// Connect to MongoDB
connectDB();

// Middleware
app.use(corsConfig);
app.use(express.json());


app.set("trust proxy", 1); // important when using secure cookies

// ✅ Use express-session instead of cookie-session
app.use(
  session({
    name: "connect.sid", // ⭐⭐⭐ THIS IS REQUIRED
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/auth", authRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/gemini", geminiRoute);
// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use("/api/exams", examRoutes);

app.use("/api/exam-batches", examBatchRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
