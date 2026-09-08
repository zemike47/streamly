const express = require("express");
const cors = require("cors");

const videoRoutes = require("./routes/video.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const authenticate = require("./middleware/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    message: "Video Platform API is running",
  });
});

app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

// Temporary CPU stress endpoint for Auto Scaling testing
app.get("/stress", (req, res) => {
  const duration = 500;
  const start = Date.now();

  while (Date.now() - start < duration) {
    Math.sqrt(Math.random() * Math.random());
  }

  res.json({
    message: "CPU stress test completed",
  });
});

app.use("/videos", videoRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

module.exports = app;
