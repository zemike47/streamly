const express = require("express");
const multer = require("multer");

const {
  getVideos,
  getVideoById,
  uploadVideo,
  deleteVideo,
} = require("../controllers/video.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", getVideos);

router.get("/:id", getVideoById);

router.post("/", authenticate, upload.single("video"), uploadVideo);

router.delete("/:id", authenticate, deleteVideo);

module.exports = router;
