"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  onError?: (error: string) => void;
  className?: string;
  variant?: "avatar" | "card";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

export function ImageUpload({
  value,
  onChange,
  onError,
  className,
  variant = "avatar",
  size = "md",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      onError?.("Please select an image file");
      return;
    }

    // Check file size (5MB limit for profile pictures)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      onError?.("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { publicUrl } = await response.json();
      onChange(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      onError?.(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (variant === "avatar") {
    return (
      <div className={cn("group relative inline-block", className)}>
        <Avatar className={cn(sizeClasses[size])}>
          <AvatarImage src={value || undefined} />
          <AvatarFallback>
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        <div
          className={cn(
            "absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100",
            sizeClasses[size],
          )}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Upload className="h-4 w-4 text-white" />
          )}
        </div>

        {/* Remove button */}
        {value && !isUploading && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              removeImage();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  // Card variant
  return (
    <div className={cn("relative", className)}>
      <div
        className="border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <div className="relative inline-block">
            <Image
              src={value || ""}
              alt="Upload preview"
              width={128}
              height={128}
              className="max-h-32 rounded-md object-contain"
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div>
            {isUploading ? (
              <Loader2 className="text-muted-foreground mx-auto mb-2 h-8 w-8 animate-spin" />
            ) : (
              <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
            )}
            <p className="text-muted-foreground text-sm">
              {isUploading ? "Uploading..." : "Click or drag to upload image"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
