require("dotenv").config();

const s3 = require("./src/config/s3");

console.log("S3 client created:", !!s3);
