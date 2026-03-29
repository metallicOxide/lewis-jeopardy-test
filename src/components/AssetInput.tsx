import { useState } from "react";
import { Image, Youtube, Plus, X } from "lucide-react";
import type { MediaType, QuestionSide } from "../types";

type AssetInputProps = {
  value: QuestionSide;
  onChange: (value: QuestionSide) => void;
  placeholder?: string;
};

const MEDIA_OPTIONS: { type: MediaType; label: string; icon: typeof Image }[] =
  [
    { type: "image", label: "Image URL", icon: Image },
    { type: "youtube", label: "YouTube URL", icon: Youtube },
  ];

const AssetInput = ({ value, onChange, placeholder }: AssetInputProps) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasMedia = !!value.media;

  const handleTextChange = (text: string) => {
    onChange({ ...value, text });
  };

  const handleSelectMediaType = (type: MediaType) => {
    onChange({ ...value, media: { type, url: "" } });
    setShowMediaPicker(false);
    setImageError(false);
  };

  const handleMediaUrlChange = (url: string) => {
    if (value.media) {
      onChange({ ...value, media: { ...value.media, url } });
      setImageError(false);
    }
  };

  const handleRemoveMedia = () => {
    onChange({ ...value, media: undefined });
    setShowMediaPicker(false);
    setImageError(false);
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
        <div className="flex gap-2">
          {MEDIA_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => handleSelectMediaType(opt.type)}
              className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-blue-200 hover:bg-blue-500 hover:text-white"
            >
              <opt.icon size={14} /> {opt.label}
            </button>
          ))}
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
              {value.media.type === "image" ? "Image URL" : "YouTube URL"}
            </span>
            <button
              onClick={handleRemoveMedia}
              className="rounded bg-gray-600 px-2 py-1 text-xs text-gray-300 hover:bg-gray-500"
            >
              <X size={12} />
            </button>
          </div>
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
          {value.media.type === "image" && value.media.url && !imageError && (
            <img
              src={value.media.url}
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
