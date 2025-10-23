import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoIntroductionProps {
  videoUrl?: string;
  builderName?: string;
  onUpload?: (file: File) => Promise<void>;
  editable?: boolean;
}

export function VideoIntroduction({
  videoUrl,
  builderName,
  onUpload,
  editable = false,
}: VideoIntroductionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid File",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Video must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await onUpload?.(file);
      toast({
        title: "Video Uploaded",
        description: "Your video introduction has been updated",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!videoUrl && !editable) {
    return null;
  }

  if (!videoUrl && editable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Video Introduction</CardTitle>
          <CardDescription>
            Add a 30-75 second video to introduce yourself (max 100MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-12 text-center hover-elevate cursor-pointer transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              data-testid="input-video-upload"
              aria-label="Upload video file"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              data-testid="button-upload-video"
              aria-label="Upload video introduction"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Video"}
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Recommended: 30-75 seconds, MP4 format
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Video Introduction</CardTitle>
            {builderName && (
              <CardDescription>Meet {builderName}</CardDescription>
            )}
          </div>
          {editable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              data-testid="button-change-video"
            >
              {uploading ? "Uploading..." : "Change Video"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative rounded-lg overflow-hidden bg-black group">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full aspect-video"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            data-testid="video-introduction"
          />

          {/* Play/Pause Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            {!isPlaying && (
              <div className="bg-primary/90 rounded-full p-4 transition-transform hover:scale-110">
                <Play className="h-12 w-12 text-white fill-current" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="space-y-2">
              {/* Progress Bar */}
              <div className="relative h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    data-testid="button-play-pause"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    data-testid="button-mute"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  data-testid="button-fullscreen"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        )}

        <div className="mt-3 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Video Introduction
          </Badge>
          {duration > 0 && duration < 75 && (
            <Badge variant="secondary" className="text-xs">
              {Math.floor(duration)}s
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
