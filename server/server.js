const dns = require("node:dns");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./config/db");
const { initializeSocket } = require("./config/socket");

const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");
const commentRoutes = require("./routes/commentRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Trust proxy in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create one shared session middleware for Express and Socket.IO.
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);

// Static Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/comments", commentRoutes);

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Alzikrayat API",
  });
});

// Error Handling Middleware
app.use(errorMiddleware);

// Create the HTTP server and attach Socket.IO to it.
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: corsOptions,
});

// Make the Socket.IO instance available to controllers through req.app.
app.set("io", io);

// Reuse the same Express session for Socket.IO handshakes.
io.engine.use(sessionMiddleware);

// Register Socket.IO events and photo rooms.
initializeSocket(io);

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI || !process.env.SESSION_SECRET || !process.env.CLIENT_URL) {
      throw new Error("Missing required environment variables.");
    }

    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Socket.IO is ready for real-time connections");
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();