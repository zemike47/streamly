const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Failed to fetch profile:", error);

    res.status(500).json({
      error: "Failed to fetch profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        name,
        avatarUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Failed to update profile:", error);

    res.status(500).json({
      error: "Failed to update profile",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
