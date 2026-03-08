// actions/drive.ts
"use server";

import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";

// Evaluate environment variables at runtime instead of module load time
const getBucketName = () => {
  const bucket = process.env.BUCKET_NAME;
  if (!bucket) {
    console.error(
      "CRITICAL ERROR: BUCKET_NAME environment variable is missing.",
    );
    throw new Error("Server configuration error.");
  }
  return bucket;
};

export async function getUploadUrl(fileName: string, contentType: string) {
  try {
    const key = `photos/${Date.now()}-${fileName.replace(/\s+/g, "-")}`;
    const command = new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return { url, key };
  } catch (error) {
    console.error("S3 Upload URL Error:", error);
    throw new Error("Failed to generate upload URL.");
  }
}

export async function listPhotos() {
  try {
    const bucketName = getBucketName();
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: "photos/",
    });

    const response = await s3Client.send(command);
    const files =
      response.Contents?.filter((file) => file.Key !== "photos/") || [];

    const photos = await Promise.all(
      files.map(async (file) => {
        const getCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: file.Key,
        });
        const url = await getSignedUrl(s3Client, getCommand, {
          expiresIn: 3600,
        });
        return { key: file.Key!, url };
      }),
    );

    return photos.reverse();
  } catch (error) {
    // This will now log the actual AWS error to your server console
    console.error("S3 List Photos Error:", error);
    throw new Error("Failed to fetch files from storage.");
  }
}

export async function deletePhoto(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    });
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("S3 Delete Error:", error);
    throw new Error("Failed to delete file.");
  }
}

export async function getDownloadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      ResponseContentDisposition: `attachment; filename="${key.split("/").pop()}"`,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 60 });
  } catch (error) {
    console.error("S3 Download URL Error:", error);
    throw new Error("Failed to generate download URL.");
  }
}
