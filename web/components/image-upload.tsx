'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@heroui/button'
import Image from 'next/image'

interface ImageUploadProps {
  label: string
  value: string | null
  onChange: (file: File | null) => void
  disabled?: boolean
  aspectRatio?: 'square' | 'landscape' | 'portrait'
}

export default function ImageUpload({ label, value, onChange, disabled, aspectRatio = 'landscape' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when value prop changes
  useEffect(() => {
    if (value && value !== preview) {
      setPreview(value)
    }
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onChange(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'portrait':
        return 'aspect-[3/4]'
      case 'landscape':
      default:
        return 'aspect-video'
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground block">{label}</label>
      
      {preview ? (
        <div className="relative">
          <div className={`relative w-full ${getAspectRatioClass()} rounded-lg overflow-hidden border border-default-200`}>
            <Image
              src={preview}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={handleRemove}
            disabled={disabled}
            className="mt-2"
          >
            Remove Image
          </Button>
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            relative w-full ${getAspectRatioClass()} 
            border-2 border-dashed border-default-300 rounded-lg
            flex flex-col items-center justify-center
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}
            bg-default-50
          `}
        >
          <svg className="w-12 h-12 text-default-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-default-600">Click to upload image</p>
          <p className="text-xs text-default-400 mt-1">PNG, JPG up to 10MB</p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  )
}
