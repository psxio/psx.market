import { apiRequest } from "./queryClient";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  publicUrl?: string;
}

export async function uploadFile(
  file: File,
  directory: "profile-photos" | "cover-images" | "portfolio" | "videos" | "documents",
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          });
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error("Invalid response format"));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

export async function uploadProfilePhoto(file: File, onProgress?: (progress: UploadProgress) => void): Promise<string> {
  const result = await uploadFile(file, "profile-photos", onProgress);
  return result.publicUrl || result.url;
}

export async function uploadCoverImage(file: File, onProgress?: (progress: UploadProgress) => void): Promise<string> {
  const result = await uploadFile(file, "cover-images", onProgress);
  return result.publicUrl || result.url;
}

export async function uploadPortfolioMedia(file: File, onProgress?: (progress: UploadProgress) => void): Promise<string> {
  const result = await uploadFile(file, "portfolio", onProgress);
  return result.publicUrl || result.url;
}

export async function uploadVideo(file: File, onProgress?: (progress: UploadProgress) => void): Promise<string> {
  const result = await uploadFile(file, "videos", onProgress);
  return result.publicUrl || result.url;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Please upload a JPEG, PNG, WebP, or GIF image" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Image must be less than 10MB" };
  }

  return { valid: true };
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Please upload an MP4, WebM, or MOV video" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Video must be less than 100MB" };
  }

  return { valid: true };
}

export function compressImage(file: File, maxWidth: number = 1200): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
