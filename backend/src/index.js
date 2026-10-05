import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import apartmentRoutes from "./routes/apartmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================================
   BASIC SECURITY
========================================================= */

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

/* =========================================================
   CORS
========================================================= */

// Local development
// Sau khi deploy frontend lên Vercel,
// thêm domain Vercel vào danh sách này.

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có Origin
      // Ví dụ: Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS: Origin không được phép"));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: false,
  }),
);

/* =========================================================
   BODY LIMIT
========================================================= */

app.use(
  express.json({
    limit: "1mb",
  }),
);

/* =========================================================
   GLOBAL RATE LIMIT
========================================================= */

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // 100 request / 15 phút / IP
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Bạn gửi quá nhiều request. Vui lòng thử lại sau.",
  },
});

app.use("/api", globalLimiter);

/* =========================================================
   ADMIN LOGIN RATE LIMIT
========================================================= */

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // Tối đa 10 lần đăng nhập / 15 phút / IP
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Quá nhiều lần đăng nhập Admin. Vui lòng thử lại sau 15 phút.",
  },
});

/* =========================================================
   ROUTES
========================================================= */

// PUBLIC APARTMENTS
app.use("/api/v1/apartments", apartmentRoutes);

// ADMIN LOGIN RATE LIMIT
app.use("/api/v1/admin/login", adminLoginLimiter);

// ADMIN
app.use("/api/v1/admin", adminRoutes);

// CLOUDINARY IMAGE API
app.use("/api/v1/images", imageRoutes);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.json({
    message: "Apartment Rental API is running",
  });
});

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint không tồn tại",
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((error, req, res, next) => {
  console.error("GLOBAL ERROR:", error);

  /* CORS ERROR */

  if (error.message?.startsWith("CORS:")) {
    return res.status(403).json({
      message: "Request từ origin không được phép",
    });
  }

  /* MONGODB DUPLICATE KEY */

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Dữ liệu đã tồn tại.",
    });
  }

  /* MONGOOSE VALIDATION */

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Dữ liệu không hợp lệ.",
      errors: error.errors,
    });
  }

  /* MONGOOSE CAST ERROR */

  if (error.name === "CastError") {
    return res.status(400).json({
      message: "ID hoặc dữ liệu không hợp lệ.",
    });
  }

  /* GENERAL ERROR */

  res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : "Internal server error",
  });
});

/* =========================================================
   MONGODB + SERVER
========================================================= */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("=================================");

    console.log("✅ Connected to MongoDB");

    console.log("📦 Database:", mongoose.connection.name);

    const count = await mongoose.connection.db
      .collection("apartments")
      .countDocuments();

    console.log("📊 Apartments:", count);

    console.log("=================================");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);

    process.exit(1);
  });

/* =========================================================
   MONGODB RUNTIME EVENTS
========================================================= */

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB runtime error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});
