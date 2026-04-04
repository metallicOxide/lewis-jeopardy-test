import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadImage } from "../supabase/imageUpload";
import { compressImage } from "../utils/image-utils";

type FileUploadDropzoneProps = {
  onUpload: (url: string) => void;
};

const FileUploadDropzone = ({ onUpload }: FileUploadDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported.");
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      const compressedBlob = await compressImage(file);
      const url = await uploadImage(compressedBlob);
      onUpload(url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={() => !isUploading && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={[
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 transition-colors",
        isDragging
          ? "border-blue-300 bg-blue-500/30"
          : "border-blue-500 bg-blue-600/20 hover:bg-blue-600/30",
        isUploading ? "pointer-events-none opacity-60" : "",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      {isUploading ? (
        <Loader2 size={24} className="animate-spin text-blue-300" />
      ) : (
        <Upload size={24} className="text-blue-300" />
      )}
      <p className="text-sm text-blue-200">
        {isUploading
          ? "Uploading…"
          : "Drag & drop an image, or click to browse"}
      </p>
      <p className="text-xs text-blue-400">PNG, JPG, GIF, WEBP supported</p>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default FileUploadDropzone;
