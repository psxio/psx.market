import { useState } from "react";
import type { UploadResult } from "@uppy/core";
import {
  getUploadUrl,
  processCompletedUpload,
  type UploadType,
  UPLOAD_CONFIGS,
} from "@/lib/fileUpload";

/**
 * Hook for managing file uploads
 * 
 * @param uploadType - Type of upload (portfolio-image, message-attachment, deliverable)
 * @param onSuccess - Callback when upload completes successfully with file paths
 * @param onError - Callback when upload fails
 */
export function useFileUpload(
  uploadType: UploadType,
  onSuccess?: (filePaths: string[]) => void,
  onError?: (error: Error) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);

  const config = UPLOAD_CONFIGS[uploadType];

  const handleGetUploadParameters = async () => {
    try {
      const url = await getUploadUrl();
      return {
        method: "PUT" as const,
        url,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Upload failed");
      onError?.(err);
      throw err;
    }
  };

  const handleComplete = async (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => {
    try {
      setIsUploading(true);
      const paths = await processCompletedUpload(uploadType, result);
      setUploadedPaths(paths);
      onSuccess?.(paths);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to process upload");
      onError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadedPaths,
    config,
    handleGetUploadParameters,
    handleComplete,
  };
}
