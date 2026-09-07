const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      password: "demo-password",
    },
  });

  await prisma.video.create({
    data: {
      title: "Introduction to AWS",
      description: "A simple test video.",
      filePath: "/uploads/aws-introduction.mp4",
      userId: user.id,
    },
  });

  console.log("Seed data created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
