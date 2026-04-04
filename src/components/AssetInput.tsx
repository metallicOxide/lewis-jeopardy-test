import { useState } from "react";
import { Image, Youtube, Upload, Plus, X, Loader2 } from "lucide-react";
import type { QuestionSide } from "../types";
import { deleteImage } from "../supabase/imageUpload";
import FileUploadDropzone from "./FileUploadDropzone";

type AssetInputProps = {
  value: QuestionSide;
  onChange: (value: QuestionSide) => void;
  placeholder?: string;
};

type MediaInputMode = "url" | "upload" | "youtube" | null;

const AssetInput = ({ value, onChange, placeholder }: AssetInputProps) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaInputMode, setMediaInputMode] = useState<MediaInputMode>(null);
  const [imageError, setImageError] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const hasMedia = !!value.media;

  const handleTextChange = (text: string) => {
    onChange({ ...value, text });
  };

  const handleSelectMode = (mode: MediaInputMode) => {
    if (mode === "youtube") {
      onChange({ ...value, media: { type: "youtube", url: "" } });
    } else {
      onChange({ ...value, media: { type: "image", url: "" } });
    }
    setMediaInputMode(mode);
    setShowMediaPicker(false);
    setImageError(false);
  };

  const handleMediaUrlChange = (url: string) => {
    if (value.media) {
      onChange({ ...value, media: { ...value.media, url } });
      setImageError(false);
    }
  };

  const handleUploadSuccess = (url: string) => {
    onChange({ ...value, media: { type: "image", url, uploaded: true } });
    setImageError(false);
  };

  const handleRemoveMedia = async () => {
    setIsRemoving(true);
    if (value.media?.uploaded && value.media.url) {
      await deleteImage(value.media.url);
    }
    onChange({ ...value, media: undefined });
    setMediaInputMode(null);
    setShowMediaPicker(false);
    setImageError(false);
    setIsRemoving(false);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value.text}
        onChange={(e) => handleTextChange(e.target.value)}
        className="w-full rounded border border-blue-500 bg-blue-600 p-2 text-white"
        placeholder={placeholder}
      />

      {!hasMedia && !showMediaPicker && (
        <button
          onClick={() => setShowMediaPicker(true)}
          className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-blue-200 hover:bg-blue-500 hover:text-white"
        >
          <Plus size={14} /> Add Media
        </button>
      )}

      {!hasMedia && showMediaPicker && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSelectMode("url")}
            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-blue-200 hover:bg-blue-500 hover:text-white"
          >
            <Image size={14} /> Image URL
          </button>
          <button
            onClick={() => handleSelectMode("upload")}
            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-blue-200 hover:bg-blue-500 hover:text-white"
          >
            <Upload size={14} /> Upload Image
          </button>
          <button
            onClick={() => handleSelectMode("youtube")}
            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-blue-200 hover:bg-blue-500 hover:text-white"
          >
            <Youtube size={14} /> YouTube URL
          </button>
          <button
            onClick={() => setShowMediaPicker(false)}
            className="rounded bg-gray-600 px-2 py-1 text-sm text-gray-300 hover:bg-gray-500"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {hasMedia && value.media && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-300 uppercase">
              {value.media.type === "youtube"
                ? "YouTube URL"
                : value.media.uploaded
                  ? "Uploaded Image"
                  : "Image URL"}
            </span>
            <button
              onClick={handleRemoveMedia}
              disabled={isRemoving}
              className="flex items-center gap-1 rounded bg-gray-600 px-2 py-1 text-xs text-gray-300 hover:bg-gray-500 disabled:opacity-50"
            >
              {isRemoving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <X size={12} />
              )}
            </button>
          </div>

          {/* Upload dropzone — shown when in upload mode and no URL yet */}
          {mediaInputMode === "upload" && !value.media.url && (
            <FileUploadDropzone onUpload={handleUploadSuccess} />
          )}

          {/* URL input — shown for manual URL entry (image or youtube) */}
          {mediaInputMode !== "upload" && (
            <input
              type="text"
              value={value.media.url}
              onChange={(e) => handleMediaUrlChange(e.target.value)}
              className="w-full rounded border border-blue-500 bg-blue-600 p-2 text-sm text-white"
              placeholder={
                value.media.type === "image"
                  ? "https://example.com/image.jpg"
                  : "https://youtube.com/watch?v=..."
              }
            />
          )}

          {/* Image preview — shown once a URL exists (uploaded or manual) */}
          {value.media.type === "image" && value.media.url && !imageError && (
            <img
              src={value.media.url}
              loading="lazy"
              className="max-h-24 rounded object-contain"
              onError={() => setImageError(true)}
            />
          )}
          {value.media.type === "image" && imageError && (
            <p className="text-xs text-red-400">Failed to load image preview</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetInput;
