const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const {
  uploadToS3,
  getVideoUrl,
  deleteFromS3,
} = require("../services/s3.service");

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

    const videosWithUrls = await Promise.all(
      videos.map(async (video) => ({
        ...video,
        filePath: await getVideoUrl(video.filePath),
      }))
    );

    res.json(videosWithUrls);
  } catch (error) {
    console.error("Failed to fetch videos:", error);

    res.status(500).json({
      error: "Failed to fetch videos",
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

    const filePath = await uploadToS3(req.file);

    const video = await prisma.video.create({
      data: {
        title,
        description,
        filePath,
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

    const videoWithUrl = {
      ...video,
      filePath: await getVideoUrl(video.filePath),
    };

    res.json(videoWithUrl);
  } catch (error) {
    console.error("Failed to fetch video:", error);

    res.status(500).json({
      error: "Failed to fetch video",
    });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const videoId = Number(req.params.id);

    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });

    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }

    if (video.userId !== req.user.userId) {
      return res.status(403).json({
        error: "You are not allowed to delete this video",
      });
    }

    await deleteFromS3(video.filePath);

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
