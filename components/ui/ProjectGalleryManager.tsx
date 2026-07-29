"use client";

import React, { useState, useRef } from "react";
import { Star, Trash2, ArrowLeft, ArrowRight, UploadCloud, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

interface ProjectGalleryManagerProps {
  coverImage: string;
  images: string[];
  onChangeCoverImage: (url: string) => void;
  onChangeImages: (urls: string[]) => void;
}

export function ProjectGalleryManager({
  coverImage,
  images = [],
  onChangeCoverImage,
  onChangeImages,
}: ProjectGalleryManagerProps) {
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine cover image into images if missing
  const allImages = Array.from(new Set([coverImage, ...images].filter(Boolean)));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    let loadedCount = 0;
    const newUrls: string[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          newUrls.push(ev.target.result as string);
        }
        loadedCount++;
        if (loadedCount === files.length) {
          const updated = Array.from(new Set([...allImages, ...newUrls]));
          onChangeImages(updated);
          if (!coverImage && updated.length > 0) {
            onChangeCoverImage(updated[0]);
          }
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const updated = Array.from(new Set([...allImages, urlInput.trim()]));
    onChangeImages(updated);
    if (!coverImage) {
      onChangeCoverImage(urlInput.trim());
    }
    setUrlInput("");
    setShowUrlInput(false);
  };

  const handleSetCover = (url: string) => {
    onChangeCoverImage(url);
  };

  const handleRemoveImage = (url: string) => {
    const updated = allImages.filter((img) => img !== url);
    onChangeImages(updated);
    if (coverImage === url) {
      onChangeCoverImage(updated[0] || "");
    }
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= allImages.length) return;

    const updated = [...allImages];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    onChangeImages(updated);
  };

  return (
    <div className="space-y-4 border border-[#E4E4E7] dark:border-[#27272A] p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#18181B]">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-3 border-b border-[#E4E4E7] dark:border-[#27272A]">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] dark:text-[#F4F4F5] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#C5A059]" />
            <span>Project Image Gallery ({allImages.length})</span>
          </h4>
          <p className="text-[11px] text-[#71717A] mt-0.5">
            Add multiple project photos, reorder position, and choose the main cover photo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="admin-btn-secondary py-1.5 px-3 text-[11px]"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{showUrlInput ? "Cancel URL" : "Add via URL"}</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="admin-btn-primary py-1.5 px-3 text-[11px]"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Images</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 bg-white dark:bg-[#141414] p-2.5 rounded-lg border border-[#E4E4E7] dark:border-[#27272A]">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL..."
            className="admin-input flex-1 text-xs"
          />
          <button type="button" onClick={handleAddUrl} className="admin-btn-primary py-2 px-3 text-xs">
            Add Photo
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      {allImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {allImages.map((imgUrl, idx) => {
            const isCover = coverImage === imgUrl;
            return (
              <div
                key={idx}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all bg-white dark:bg-[#141414] ${
                  isCover
                    ? "border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/20"
                    : "border-[#E4E4E7] dark:border-[#27272A] hover:border-[#C5A059]/50"
                }`}
              >
                {/* Thumbnail Image */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-black/5">
                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </div>

                {/* Main Cover Badge */}
                {isCover && (
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#C5A059] text-white text-[9px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Main Cover</span>
                  </div>
                )}

                {/* Control Action Toolbar */}
                <div className="p-2 bg-white/95 dark:bg-[#141414]/95 backdrop-blur-xs flex items-center justify-between gap-1 border-t border-[#E4E4E7] dark:border-[#27272A]">
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(imgUrl)}
                      className="px-2 py-1 rounded text-[10px] font-semibold text-[#C5A059] bg-[#C5A059]/10 hover:bg-[#C5A059] hover:text-white transition-colors cursor-pointer"
                      title="Set as Main Cover Photo"
                    >
                      Make Cover
                    </button>
                  )}

                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "left")}
                      className="p-1 text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-[#F4F4F5] disabled:opacity-30 cursor-pointer"
                      title="Move position left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === allImages.length - 1}
                      onClick={() => handleMove(idx, "right")}
                      className="p-1 text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-[#F4F4F5] disabled:opacity-30 cursor-pointer"
                      title="Move position right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(imgUrl)}
                      className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center border-2 border-dashed border-[#E4E4E7] dark:border-[#27272A] rounded-xl">
          <ImageIcon className="w-8 h-8 text-[#71717A] mx-auto mb-2" />
          <p className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">No project images uploaded yet</p>
          <p className="text-[10px] text-[#71717A] mt-0.5">Click &quot;Upload Images&quot; above to select multiple photos.</p>
        </div>
      )}
    </div>
  );
}
