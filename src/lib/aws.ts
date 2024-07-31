import { S3Client, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function generatePresignedUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

export async function generatePresignedUploadUrl(key: string, contentType: string, expiresIn = 3600) {
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Key: key,
    ContentType: contentType,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    throw error;
  }
}

export async function generatePresignedDeleteUrl(key: string, expiresIn = 3600) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned delete URL:', error);
    throw error;
  }
}

export async function listObjects(prefix: string) {
  const command = new ListObjectsV2Command({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Prefix: prefix,
  });

  try {
    const data = await s3Client.send(command);
    return data.Contents?.map((file) => ({
      key: file.Key,
      url: `https://${command.input.Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${file.Key}`,
    })) || [];
  } catch (error) {
    console.error('Error listing objects:', error);
    throw error;
  }
}

export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting object:', error);
    throw error;
  }
}

export default s3Client;