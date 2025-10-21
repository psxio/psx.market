import type { UploadResult } from "@uppy/core";

/**
 * File upload utilities for create.psx
 * 
 * Provides helper functions for handling file uploads with Replit Object Storage
 */

export type UploadType = "portfolio-image" | "message-attachment" | "deliverable";

export interface FileUploadConfig {
  maxFileSize?: number;
  maxNumberOfFiles?: number;
  allowedFileTypes?: string[];
}

/**
 * Default configurations for different upload types
 */
export const UPLOAD_CONFIGS: Record<UploadType, FileUploadConfig> = {
  "portfolio-image": {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxNumberOfFiles: 10,
    allowedFileTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  },
  "message-attachment": {
    maxFileSize: 25 * 1024 * 1024, // 25MB
    maxNumberOfFiles: 5,
    allowedFileTypes: [
      "image/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ],
  },
  "deliverable": {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxNumberOfFiles: 10,
    allowedFileTypes: [], // Allow all file types
  },
};

/**
 * Get presigned upload URL from the backend
 */
export async function getUploadUrl(): Promise<string> {
  const response = await fetch("/api/objects/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }

  const data = await response.json();
  return data.uploadURL;
}

/**
 * Set ACL policy for uploaded file
 */
export async function setFileAcl(
  uploadType: UploadType,
  fileURL: string
): Promise<string> {
  const endpoints: Record<UploadType, string> = {
    "portfolio-image": "/api/upload/portfolio-image",
    "message-attachment": "/api/upload/message-attachment",
    "deliverable": "/api/upload/deliverable",
  };

  const bodyKey = uploadType === "portfolio-image" ? "imageURL" : "fileURL";

  const response = await fetch(endpoints[uploadType], {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ [bodyKey]: fileURL }),
  });

  if (!response.ok) {
    throw new Error(`Failed to set ACL for ${uploadType}`);
  }

  const data = await response.json();
  return data.objectPath;
}

/**
 * Extract uploaded file URLs from Uppy result
 */
export function extractFileUrls(
  result: UploadResult<Record<string, unknown>, Record<string, unknown>>
): string[] {
  if (!result.successful) return [];
  return result.successful.map((file) => file.uploadURL as string);
}

/**
 * Process completed upload - set ACL and return normalized paths
 */
export async function processCompletedUpload(
  uploadType: UploadType,
  result: UploadResult<Record<string, unknown>, Record<string, unknown>>
): Promise<string[]> {
  const urls = extractFileUrls(result);
  
  const paths = await Promise.all(
    urls.map((url) => setFileAcl(uploadType, url))
  );

  return paths;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Validate file type
 */
export function isValidFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  if (allowedTypes.length === 0) return true;

  return allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      const prefix = type.slice(0, -2);
      return file.type.startsWith(prefix);
    }
    return file.type === type;
  });
}

/**
 * Convert object path to full URL
 */
export function getFileUrl(objectPath: string): string {
  if (objectPath.startsWith("http")) {
    return objectPath;
  }
  return `${window.location.origin}${objectPath}`;
}
