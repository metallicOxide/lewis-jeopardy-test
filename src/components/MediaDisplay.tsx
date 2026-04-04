import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Media } from "../types";
import { getYouTubeEmbedUrl } from "../utils";

type MediaDisplayProps = {
  media: Media;
  enlargeable?: boolean;
  lazy?: boolean;
  className?: string;
};

const ImageLightbox = ({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
      >
        <X size={24} />
      </button>
      <img
        src={src}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  );
};

const MediaDisplay = ({
  media,
  enlargeable,
  lazy,
  className,
}: MediaDisplayProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (media.type === "image") {
    if (imageError) {
      return (
        <div
          className={`flex max-h-[400px] max-w-[600px] items-center justify-center rounded-lg bg-gray-800 p-4 text-gray-400 ${className ?? ""}`}
        >
          Failed to load image
        </div>
      );
    }

    return (
      <div className={className}>
        <img
          src={media.url}
          loading={lazy ? "lazy" : "eager"}
          className={`max-h-[400px] max-w-[600px] rounded-lg object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${enlargeable ? "cursor-pointer hover:opacity-80" : ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setImageError(true)}
          onClick={enlargeable ? () => setLightboxOpen(true) : undefined}
        />
        {lightboxOpen && (
          <ImageLightbox
            src={media.url}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </div>
    );
  }

  if (media.type === "youtube") {
    const embedUrl = getYouTubeEmbedUrl(media.url);
    if (!embedUrl) {
      return (
        <div
          className={`flex items-center justify-center rounded-lg bg-gray-800 p-4 text-gray-400 ${className ?? ""}`}
        >
          Invalid YouTube URL
        </div>
      );
    }

    return (
      <div className={`aspect-video max-w-[600px] ${className ?? ""}`}>
        <iframe
          src={embedUrl}
          loading={lazy ? "lazy" : "eager"}
          allowFullScreen
          className="h-full w-full rounded-lg"
        />
      </div>
    );
  }

  return null;
};

export default MediaDisplay;
