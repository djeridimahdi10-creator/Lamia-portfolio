"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Trash2, RefreshCw, CheckCircle2, AlertCircle, Link as LinkIcon, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  accept?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  maxSizeMb?: number;
  maxDimension?: number;
}

function resizeImage(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      // Only resize if either dimension exceeds maxDim
      if (width <= maxDim && height <= maxDim) {
        // No resize needed, read as data URL directly
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
        return;
      }

      // Calculate new dimensions maintaining aspect ratio
      if (width > height) {
        height = Math.round((height / width) * maxDim);
        width = maxDim;
      } else {
        width = Math.round((width / height) * maxDim);
        height = maxDim;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      // Use high quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP for better compression, fallback to JPEG
      const quality = 0.85;
      let dataUrl = canvas.toDataURL("image/webp", quality);
      if (!dataUrl.startsWith("data:image/webp")) {
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = src;
  });
}

const VALID_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
const VALID_PDF_TYPES = ["application/pdf"];

export function ImageUploader({
  label,
  value,
  onChange,
  accept = "image/png, image/jpeg, image/webp, image/svg+xml, application/pdf",
  aspectRatio = "auto",
  maxSizeMb = 5,
  maxDimension = 800,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState(value || "");
  const [imageDims, setImageDims] = useState<{ width: number; height: number } | null>(null);
  const [wasResized, setWasResized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setWasResized(false);

    // Validate file size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMb}MB limit. Please choose a smaller file.`);
      return;
    }

    // Validate file type
    const isPdf = VALID_PDF_TYPES.includes(file.type);
    const isImage = VALID_IMAGE_TYPES.includes(file.type);
    if (!isPdf && !isImage) {
      setError("Invalid file type. Please upload PNG, JPG, WebP, SVG, or PDF.");
      return;
    }

    setIsUploading(true);
    setProgress(20);

    try {
      if (isPdf) {
        // PDFs: just read as data URL (no resize)
        const reader = new FileReader();
        const result = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error("Failed to read PDF"));
          reader.readAsDataURL(file);
        });
        setProgress(100);
        setTimeout(() => {
          onChange(result);
          setTempUrl(result);
          setIsUploading(false);
          setImageDims(null);
        }, 200);
      } else {
        // Images: validate and optionally resize
        setProgress(40);
        const dataUrl = await resizeImage(file, maxDimension);
        setProgress(80);

        // Check if it was resized
        const origImg = new window.Image();
        const origUrl = URL.createObjectURL(file);
        const origDims = await new Promise<{ w: number; h: number }>((resolve) => {
          origImg.onload = () => {
            URL.revokeObjectURL(origUrl);
            resolve({ w: origImg.naturalWidth, h: origImg.naturalHeight });
          };
          origImg.onerror = () => {
            URL.revokeObjectURL(origUrl);
            resolve({ w: 0, h: 0 });
          };
          origImg.src = origUrl;
        });

        if (origDims.w > maxDimension || origDims.h > maxDimension) {
          setWasResized(true);
        }

        setProgress(100);
        setTimeout(() => {
          onChange(dataUrl);
          setTempUrl(dataUrl);
          setIsUploading(false);
          // Get dimensions of the final image
          getImageDimensions(dataUrl).then(setImageDims);
        }, 200);
      }
    } catch (err) {
      setIsUploading(false);
      setError(err instanceof Error ? err.message : "Failed to process file.");
    }
  };

  // Load dimensions for existing images
  const loadDimensions = React.useCallback((src: string) => {
    if (src && !src.endsWith(".pdf") && !src.startsWith("data:application/pdf")) {
      getImageDimensions(src).then((dims) => {
        if (dims.width > 0) setImageDims(dims);
        else setImageDims(null);
      });
    } else {
      setImageDims(null);
    }
  }, []);

  // Track value changes via ref to avoid sync setState in effect
  const prevValueRef = React.useRef(value);
  if (prevValueRef.current !== value) {
    prevValueRef.current = value;
    // Schedule async dimension loading
    if (value && !value.endsWith(".pdf") && !value.startsWith("data:application/pdf")) {
      getImageDimensions(value).then((dims) => {
        if (dims.width > 0) setImageDims(dims);
        else setImageDims(null);
      });
    } else if (!value) {
      // Intentionally not calling setState synchronously here
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUrlSubmit = () => {
    if (tempUrl.trim()) {
      onChange(tempUrl.trim());
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setTempUrl("");
    setError(null);
    setImageDims(null);
    setWasResized(false);
  };

  const aspectClasses = {
    square: "aspect-square max-w-[160px]",
    video: "aspect-video max-w-sm",
    portrait: "aspect-[3/4] max-w-[160px]",
    auto: "h-36 max-w-full",
  }[aspectRatio];

  const isPdf = value?.endsWith(".pdf") || value?.startsWith("data:application/pdf");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? "Use File Upload" : "Enter URL"}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Paste image URL or path..."
            className="admin-input flex-1 text-xs"
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
          />
          <button type="button" onClick={handleUrlSubmit} className="admin-btn-primary py-2 px-3 text-xs">
            Apply
          </button>
        </div>
      ) : value ? (
        /* Preview Card */
        <div className="relative group border border-[#E4E4E7] dark:border-[#1C1C1C] rounded-xl overflow-hidden bg-[#FAFAFA] dark:bg-[#0D0D0D] p-3 flex flex-col sm:flex-row items-center gap-4">
          <div className={`relative overflow-hidden rounded-lg border border-[#C5A059]/30 bg-black/5 dark:bg-white/5 ${aspectClasses} shrink-0 w-full sm:w-auto`}>
            {isPdf ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#C5A059]/10">
                <span className="font-mono text-xs font-bold text-[#C5A059] uppercase">PDF Document</span>
              </div>
            ) : (
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Media Loaded</span>
            </div>
            {imageDims && imageDims.width > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] text-[#71717A]">
                <ImageIcon className="w-3 h-3 shrink-0" />
                <span className="font-mono">{imageDims.width} × {imageDims.height}px</span>
                {wasResized && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] font-bold text-[9px] uppercase">
                    Optimized
                  </span>
                )}
              </div>
            )}
            <p className="text-[10px] text-[#71717A] truncate font-mono max-w-xs">
              {value.startsWith("data:") ? `Data URL (${Math.round(value.length / 1024)}KB)` : value}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#52525B] hover:text-[#C5A059] hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Replace image"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleInputChange} className="hidden" />
        </div>
      ) : (
        /* Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
            isDragging
              ? "border-[#C5A059] bg-[#C5A059]/10 scale-[0.99]"
              : "border-[#E4E4E7] dark:border-[#1C1C1C] hover:border-[#C5A059]/50 bg-[#FAFAFA] dark:bg-[#0D0D0D]"
          }`}
        >
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleInputChange} className="hidden" />

          {isUploading ? (
            <div className="space-y-3 py-2">
              <RefreshCw className="w-8 h-8 text-[#C5A059] animate-spin mx-auto" />
              <p className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">Processing file...</p>
              <div className="w-48 mx-auto bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#C5A059] h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center mx-auto">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0A0A0A] dark:text-[#F4F4F5]">
                  <span className="text-[#C5A059] font-bold">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-[#71717A] mt-1">PNG, JPG, WebP, SVG, PDF up to {maxSizeMb}MB</p>
                <p className="text-[10px] text-[#71717A]">Images auto-optimized to {maxDimension}px max</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-red-500 text-xs font-semibold p-2 rounded-lg bg-red-500/5 border border-red-500/10">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
