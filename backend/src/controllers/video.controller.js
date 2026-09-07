const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get all videos
const getVideos = async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(videos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);

    res.status(500).json({
      error: "Failed to fetch videos",
    });
  }
};

// Get one video by ID
const getVideoById = async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }

    res.json(video);
  } catch (error) {
    console.error("Failed to fetch video:", error);

    res.status(500).json({
      error: "Failed to fetch video",
    });
  }
};

// Upload video
const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Video file is required",
      });
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        filePath: req.file.path,
        userId: req.user.userId,
      },
    });

    res.status(201).json(video);
  } catch (error) {
    console.error("Upload failed:", error);

    res.status(500).json({
      error: "Upload failed",
    });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const videoId = Number(req.params.id);

    // Find the video
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });

    // Video doesn't exist
    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }

    // Check ownership
    if (video.userId !== req.user.userId) {
      return res.status(403).json({
        error: "You are not allowed to delete this video",
      });
    }

    // Delete video
    await prisma.video.delete({
      where: {
        id: videoId,
      },
    });

    res.json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete failed:", error);

    res.status(500).json({
      error: "Failed to delete video",
    });
  }
};

module.exports = {
  getVideos,
  getVideoById,
  uploadVideo,
  deleteVideo,
};
