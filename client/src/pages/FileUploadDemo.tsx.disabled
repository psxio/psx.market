import { useState } from "react";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileImage, Paperclip, Package } from "lucide-react";
import { getFileUrl } from "@/lib/fileUpload";

/**
 * Demo page showing how to use the ObjectUploader component
 * 
 * This demonstrates three different upload types:
 * 1. Portfolio images (public, for builder profiles)
 * 2. Message attachments (private, for chat messages)
 * 3. Deliverables (private, for project submissions)
 */
export default function FileUploadDemo() {
  const { toast } = useToast();
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState<string[]>([]);

  const portfolioUpload = useFileUpload(
    "portfolio-image",
    (paths) => {
      setPortfolioImages([...portfolioImages, ...paths]);
      toast({
        title: "Portfolio images uploaded",
        description: `Successfully uploaded ${paths.length} image(s)`,
      });
    },
    (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    }
  );

  const attachmentUpload = useFileUpload(
    "message-attachment",
    (paths) => {
      setAttachments([...attachments, ...paths]);
      toast({
        title: "Attachments uploaded",
        description: `Successfully uploaded ${paths.length} file(s)`,
      });
    },
    (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    }
  );

  const deliverableUpload = useFileUpload(
    "deliverable",
    (paths) => {
      setDeliverables([...deliverables, ...paths]);
      toast({
        title: "Deliverables uploaded",
        description: `Successfully uploaded ${paths.length} file(s)`,
      });
    },
    (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    }
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">File Upload Demo</h1>
        <p className="text-muted-foreground mt-2">
          Test the file upload system with different upload types
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Portfolio Images Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Portfolio Images
            </CardTitle>
            <CardDescription>
              Public images for builder profiles (max 10MB each)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ObjectUploader
              maxNumberOfFiles={portfolioUpload.config.maxNumberOfFiles}
              maxFileSize={portfolioUpload.config.maxFileSize}
              onGetUploadParameters={portfolioUpload.handleGetUploadParameters}
              onComplete={portfolioUpload.handleComplete}
              buttonVariant="outline"
              data-testid="button-upload-portfolio"
            >
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Images
              </div>
            </ObjectUploader>

            {portfolioImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded ({portfolioImages.length}):</p>
                <div className="grid grid-cols-2 gap-2">
                  {portfolioImages.map((path, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                      <img
                        src={getFileUrl(path)}
                        alt={`Portfolio ${idx + 1}`}
                        className="object-cover w-full h-full"
                        data-testid={`img-portfolio-${idx}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Attachments Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Message Attachments
            </CardTitle>
            <CardDescription>
              Private files for chat messages (max 25MB each)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ObjectUploader
              maxNumberOfFiles={attachmentUpload.config.maxNumberOfFiles}
              maxFileSize={attachmentUpload.config.maxFileSize}
              onGetUploadParameters={attachmentUpload.handleGetUploadParameters}
              onComplete={attachmentUpload.handleComplete}
              buttonVariant="outline"
              data-testid="button-upload-attachment"
            >
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </div>
            </ObjectUploader>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded ({attachments.length}):</p>
                <ul className="text-sm space-y-1">
                  {attachments.map((path, idx) => (
                    <li
                      key={idx}
                      className="truncate text-muted-foreground"
                      data-testid={`text-attachment-${idx}`}
                    >
                      {path}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deliverables Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Deliverables
            </CardTitle>
            <CardDescription>
              Private files for project deliverables (max 50MB each)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ObjectUploader
              maxNumberOfFiles={deliverableUpload.config.maxNumberOfFiles}
              maxFileSize={deliverableUpload.config.maxFileSize}
              onGetUploadParameters={deliverableUpload.handleGetUploadParameters}
              onComplete={deliverableUpload.handleComplete}
              buttonVariant="outline"
              data-testid="button-upload-deliverable"
            >
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Deliverables
              </div>
            </ObjectUploader>

            {deliverables.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded ({deliverables.length}):</p>
                <ul className="text-sm space-y-1">
                  {deliverables.map((path, idx) => (
                    <li
                      key={idx}
                      className="truncate text-muted-foreground"
                      data-testid={`text-deliverable-${idx}`}
                    >
                      {path}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
          <CardDescription>
            How to integrate file uploads into your components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            <code>{`import { ObjectUploader } from "@/components/ObjectUploader";
import { useFileUpload } from "@/hooks/useFileUpload";

function MyComponent() {
  const upload = useFileUpload(
    "portfolio-image",
    (paths) => console.log("Uploaded:", paths),
    (error) => console.error("Error:", error)
  );

  return (
    <ObjectUploader
      maxNumberOfFiles={upload.config.maxNumberOfFiles}
      maxFileSize={upload.config.maxFileSize}
      onGetUploadParameters={upload.handleGetUploadParameters}
      onComplete={upload.handleComplete}
    >
      Upload Files
    </ObjectUploader>
  );
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
