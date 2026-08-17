import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import passport from "passport";

import connectDB from "./db/connectdb";
import { applyPassportStrategy } from "./middlewares/passport";
import serverRoutes from "./routes/serverRoutes";

// Load Environment Variables
dotenv.config();

// Initialize Express App
const app = express();

// Set up CORS
app.use(cors());

// Set up Middlewares
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize Passport Authentication Strategy
applyPassportStrategy(passport);

// Load Server Routes
app.use("/", serverRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    status: false,
    message: err.message || "Internal Server Error"
  });
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 3002;
const DATABASE_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/lms";

connectDB(DATABASE_URL);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
