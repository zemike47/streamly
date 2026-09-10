const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = require("../config/s3");

const uploadToS3 = async (file) => {
  const key = `videos/${Date.now()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return key;
};

const getVideoUrl = async (key) => {
  return `https://d1iu97j4aru12m.cloudfront.net/${key}`;
};

const deleteFromS3 = async (key) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    })
  );
};

module.exports = {
  uploadToS3,
  getVideoUrl,
  deleteFromS3,
};
