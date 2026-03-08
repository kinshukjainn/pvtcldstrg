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

const Bucketname = process.env.BUCKET_NAME as string;

export async function getUploadUrl(fileName: string, contentType: string) {
  const key = `photos/${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

  const command = new PutObjectCommand({
    Bucket: Bucketname,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  return { url, key };
}

export async function listPhotos() {
  const command = new ListObjectsV2Command({
    Bucket: Bucketname,
    Prefix: "photos/",
  });

  const response = await s3Client.send(command);
  const files =
    response.Contents?.filter((file) => file.Key !== "photos/") || [];

  const photos = await Promise.all(
    files.map(async (file) => {
      const getCommand = new GetObjectCommand({
        Bucket: Bucketname,
        Key: file.Key,
      });
      // Generate a temporary viewing URL valid for 1 hour
      const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
      return { key: file.Key!, url };
    }),
  );

  // Sort newest first
  return photos.reverse();
}

export async function deletePhoto(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: Bucketname,
    Key: key,
  });
  await s3Client.send(command);
  return { success: true };
}

export async function getDownloadUrl(key: string) {
  // Forces the browser to download the file rather than just viewing it
  const command = new GetObjectCommand({
    Bucket: Bucketname,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${key.split("/").pop()}"`,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 60 });
}
