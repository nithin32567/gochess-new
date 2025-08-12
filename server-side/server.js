
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import path from "path";

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:5173"], // No wildcard when credentials: true
  credentials: true, // Allow cookies and auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ['Set-Cookie'],   
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Connect to Database 
connectDB();

// Routes
app.use("/api", indexRoutes);
app.use(express.static("../client-side/dist"));
app.get("*path", (req, res) => res.sendFile(path.resolve("../client-side/dist/index.html")));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

