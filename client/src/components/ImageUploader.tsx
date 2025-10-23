import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Check } from "lucide-react";
import { getUploadUrl, setFileAcl } from "@/lib/fileUpload";

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  label?: string;
  className?: string;
  maxSizeMB?: number;
}

export function ImageUploader({
  onUploadComplete,
  currentImage,
  label = "Upload Image",
  className = "",
  maxSizeMB = 10,
}: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file
      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`Image must be less than ${maxSizeMB}MB`);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a JPEG, PNG, WebP, or GIF image");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPreview(reader.result?.toString() || "");
        setShowPreviewDialog(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Get presigned upload URL
      setUploadProgress(10);
      const uploadURL = await getUploadUrl();

      // Upload to object storage
      setUploadProgress(30);
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      setUploadProgress(70);

      // Set ACL to make it public
      const objectPath = await setFileAcl("portfolio-image", uploadURL.split("?")[0]);
      
      setUploadProgress(100);

      // Return the object path
      onUploadComplete(objectPath);
      
      setShowPreviewDialog(false);
      setSelectedFile(null);
      setPreview("");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-4 ${className}`}>
        {currentImage && (
          <div className="relative w-20 h-20 rounded-md overflow-hidden border">
            <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onSelectFile}
            className="hidden"
            data-testid="input-image-file"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            data-testid="button-select-image"
          >
            <Upload className="w-4 h-4 mr-2" />
            {label}
          </Button>
        </div>
      </div>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {preview && (
              <div className="max-h-[500px] overflow-auto flex items-center justify-center bg-muted/30 rounded-md">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-[500px] rounded-md"
                />
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPreviewDialog(false);
                setSelectedFile(null);
                setPreview("");
              }}
              disabled={uploading}
              data-testid="button-cancel-upload"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              data-testid="button-confirm-upload"
            >
              <Check className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
