import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Download, ExternalLink } from "lucide-react";

interface PortfolioItem {
  url: string;
  caption?: string;
  type?: "image" | "video";
}

interface PortfolioLightboxProps {
  items: PortfolioItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PortfolioLightbox({
  items,
  initialIndex = 0,
  isOpen,
  onClose,
}: PortfolioLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync currentIndex when initialIndex or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isOpen]);

  const currentItem = items[currentIndex];
  const hasMultiple = items.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl h-[90vh] p-0 bg-black/95 border-0"
        onKeyDown={handleKeyDown as any}
      >
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white">
              {currentItem?.caption && (
                <p className="text-sm font-medium">{currentItem.caption}</p>
              )}
              {hasMultiple && (
                <p className="text-xs text-gray-400">
                  {currentIndex + 1} / {items.length}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => window.open(currentItem?.url, "_blank")}
                data-testid="button-open-external"
                aria-label="Open in new tab"
              >
                <ExternalLink className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={onClose}
                data-testid="button-close-lightbox"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center p-16">
            {currentItem?.type === "video" ? (
              <video
                src={currentItem.url}
                controls
                className="max-w-full max-h-full rounded-lg"
                autoPlay
                data-testid="video-portfolio"
              />
            ) : (
              <img
                src={currentItem?.url}
                alt={currentItem?.caption || "Portfolio item"}
                className="max-w-full max-h-full object-contain rounded-lg"
                data-testid="img-portfolio"
              />
            )}
          </div>

          {/* Navigation */}
          {hasMultiple && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={goToPrevious}
                data-testid="button-previous"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={goToNext}
                data-testid="button-next"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Thumbnail Strip */}
          {hasMultiple && items.length <= 10 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-2 overflow-x-auto">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? "border-primary scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    data-testid={`thumbnail-${index}`}
                  >
                    {item.type === "video" ? (
                      <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                        <span className="text-xs text-white">Video</span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Portfolio Grid Component
interface PortfolioGridProps {
  items: PortfolioItem[];
  columns?: 2 | 3 | 4;
}

export function PortfolioGrid({ items, columns = 3 }: PortfolioGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative aspect-square rounded-lg overflow-hidden hover-elevate"
            data-testid={`portfolio-item-${index}`}
          >
            {item.type === "video" ? (
              <video
                src={item.url}
                className="w-full h-full object-cover"
                muted
              />
            ) : (
              <img
                src={item.url}
                alt={item.caption || `Portfolio item ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
            </div>
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm font-medium line-clamp-2">
                  {item.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      <PortfolioLightbox
        items={items}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
