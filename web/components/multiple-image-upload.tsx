"use client";

import { Button } from "@heroui/button";
import Image from "next/image";
import { useState, useRef } from "react";

interface MultipleImageUploadProps {
  label: string;
  value: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

export default function MultipleImageUpload({
  label,
  value,
  onChange,
  disabled,
  maxImages = 10,
}: MultipleImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + value.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);

      return;
    }

    const newFiles = [...value, ...files];

    onChange(newFiles);

    // Create previews
    const newPreviews = [...previews];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    onChange(newFiles);
    setPreviews(newPreviews);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...value];
    const newPreviews = [...previews];

    [newFiles[index], newFiles[index - 1]] = [
      newFiles[index - 1],
      newFiles[index],
    ];
    [newPreviews[index], newPreviews[index - 1]] = [
      newPreviews[index - 1],
      newPreviews[index],
    ];

    onChange(newFiles);
    setPreviews(newPreviews);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const newFiles = [...value];
    const newPreviews = [...previews];

    [newFiles[index], newFiles[index + 1]] = [
      newFiles[index + 1],
      newFiles[index],
    ];
    [newPreviews[index], newPreviews[index + 1]] = [
      newPreviews[index + 1],
      newPreviews[index],
    ];

    onChange(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground block">
        {label}
      </label>

      {/* Uploaded Images Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-default-200">
                <Image
                  fill
                  alt={`Product image ${index + 1}`}
                  className="object-cover"
                  src={preview}
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  isIconOnly
                  className="bg-white/90"
                  color="default"
                  disabled={disabled || index === 0}
                  size="sm"
                  variant="flat"
                  onPress={() => handleMoveUp(index)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 15l7-7 7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Button>

                <Button
                  isIconOnly
                  className="bg-white/90"
                  color="default"
                  disabled={disabled || index === value.length - 1}
                  size="sm"
                  variant="flat"
                  onPress={() => handleMoveDown(index)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 9l-7 7-7-7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Button>

                <Button
                  isIconOnly
                  className="bg-white/90"
                  color="danger"
                  disabled={disabled}
                  size="sm"
                  variant="flat"
                  onPress={() => handleRemove(index)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {value.length < maxImages && (
        <button
          type="button"
          className={`
            relative w-full aspect-square max-w-[200px]
            border-2 border-dashed border-default-300 rounded-lg
            flex flex-col items-center justify-center
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary"}
            bg-default-50 text-left
          `}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <svg
            className="w-10 h-10 text-default-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 4v16m8-8H4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <p className="text-sm text-default-600">Add Images</p>
          <p className="text-xs text-default-400 mt-1">
            {value.length}/{maxImages}
          </p>
        </button>
      )}

      <input
        ref={fileInputRef}
        multiple
        accept="image/*"
        className="hidden"
        disabled={disabled}
        type="file"
        onChange={handleFileChange}
      />

      <p className="text-xs text-default-400">
        First image will be the main product image. You can reorder images by
        using up/down arrows.
      </p>
    </div>
  );
}
