'use client';

import React, { useState, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [optimizedSize, setOptimizedSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback(
    (file: File): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Scale down proportionally
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas context unavailable'));

            // High-quality downscaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) return reject(new Error('Compression failed'));
                resolve(blob);
              },
              'image/webp',
              quality
            );
          };
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    },
    [maxWidth, maxHeight, quality]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      setProgress(10);
      setOriginalSize(file.size);

      try {
        // Validate
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select an image file');
        }
        if (file.size > 20 * 1024 * 1024) {
          throw new Error('File too large (max 20MB)');
        }

        // Compress
        setProgress(30);
        const compressed = await compressImage(file);
        setOptimizedSize(compressed.size);
        setProgress(60);

        // Upload to Supabase Storage
        const supabase = createClient();
        const timestamp = Date.now();
        const safeName = file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[^a-zA-Z0-9-_]/g, '_')
          .toLowerCase();
        const filePath = `uploads/${timestamp}_${safeName}.webp`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, compressed, {
            contentType: 'image/webp',
            cacheControl: '31536000',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        setProgress(90);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;
        onChange(publicUrl);
        setProgress(100);

        setTimeout(() => {
          setProgress(0);
          setUploading(false);
        }, 800);
      } catch (err: any) {
        setError(err.message || 'Upload failed');
        setUploading(false);
        setProgress(0);
      }
    },
    [compressImage, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const savings =
    originalSize && optimizedSize
      ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
      : null;

  return (
    <div className="img-uploader-wrap">
      <label>{label}</label>

      {/* Drop Zone */}
      <div
        className={`img-drop-zone ${dragOver ? 'drag-over' : ''} ${value ? 'has-preview' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <div className="img-preview-row">
            <img src={value} alt="Preview" className="img-thumb" />
            <div className="img-preview-info">
              <span className="img-preview-url">{value.split('/').pop()}</span>
              {savings !== null && savings > 0 && (
                <span className="img-savings">
                  ✅ Optimized: {formatSize(optimizedSize!)} ({savings}% smaller)
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="img-drop-placeholder">
            <span className="img-drop-icon">📸</span>
            <span>Drag & drop an image, or click to browse</span>
            <span className="img-drop-hint">Auto-converted to WebP · Max 1600×1200</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="img-progress-bar">
          <div className="img-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Error */}
      {error && <div className="img-error">{error}</div>}

      {/* Manual URL fallback */}
      <div className="img-url-row">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL manually..."
          className="img-url-input"
        />
        {value && (
          <button
            type="button"
            className="img-clear-btn"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              setOriginalSize(null);
              setOptimizedSize(null);
            }}
          >
            ✕
          </button>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .img-uploader-wrap { margin-bottom: 1.25rem; }
        .img-drop-zone {
          border: 2px dashed var(--border);
          border-radius: 10px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fafbfc;
          margin-bottom: 0.5rem;
        }
        .img-drop-zone:hover, .img-drop-zone.drag-over {
          border-color: var(--gold);
          background: rgba(212,175,55,0.05);
        }
        .img-drop-zone.has-preview { padding: 0.75rem; }
        .img-drop-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-muted);
          font-size: 0.88rem;
          padding: 1rem 0;
        }
        .img-drop-icon { font-size: 2rem; margin-bottom: 0.25rem; }
        .img-drop-hint { font-size: 0.75rem; opacity: 0.6; }
        .img-preview-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .img-thumb {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid var(--border);
          flex-shrink: 0;
        }
        .img-preview-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }
        .img-preview-url {
          font-size: 0.82rem;
          color: var(--navy);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .img-savings {
          font-size: 0.75rem;
          color: #16a34a;
          font-weight: 500;
        }
        .img-progress-bar {
          height: 4px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .img-progress-fill {
          height: 100%;
          background: var(--gold);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .img-error {
          color: #ef4444;
          font-size: 0.82rem;
          margin-bottom: 0.5rem;
        }
        .img-url-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .img-url-input {
          flex: 1;
          padding: 8px 12px !important;
          font-size: 0.82rem !important;
          border: 1px solid var(--border) !important;
          border-radius: 6px !important;
          margin-bottom: 0 !important;
          color: var(--text-muted);
        }
        .img-clear-btn {
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          color: var(--text-muted);
          font-size: 0.85rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .img-clear-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }
      `,
        }}
      />
    </div>
  );
}
