import { S3Client } from "@aws-sdk/client-s3";

if (
  !process.env.REGION ||
  !process.env.ACCESS_KEY_ID ||
  !process.env.SECRET_ACCESS_KEY
) {
  console.warn(
    "⚠️ WARNING: One or more AWS S3 Environment Variables are missing!",
  );
}

export const s3Client = new S3Client({
  region: process.env.REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});
