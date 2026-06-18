'use client';

import React, { useState, useRef } from 'react';
import { useAdmin } from './AdminProvider';
import { createClient } from '@/lib/supabase/client';

interface LiveImageProps {
  contentKey: string;
  initialUrl: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  sizes?: string;
  srcSet?: string;
  loading?: "eager" | "lazy";
}

export default function LiveImage({ contentKey, initialUrl, alt = '', className = '', style, width, height, sizes, srcSet, loading }: LiveImageProps) {
  const { isAdmin } = useAdmin();
  const [url, setUrl] = useState(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const timestamp = Date.now();
      const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
      const filePath = `uploads/${timestamp}_${safeName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '31536000',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // Update Site Content Table
      const { error: dbError } = await supabase
        .from('site_content')
        .update({ content_value: publicUrl, updated_at: new Date().toISOString() })
        .eq('content_key', contentKey);
      
      if (dbError) throw dbError;

      setUrl(publicUrl);
    } catch (err) {
      console.error('Failed to upload and save image:', err);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isAdmin) {
    return (
      <img
        src={url}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={className}
        style={style}
        width={width}
        height={height}
        loading={loading}
      />
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} className="live-image-container">
      <img
        src={url}
        alt={alt}
        className={className}
        style={{ ...style, opacity: isUploading ? 0.5 : 1 }}
        width={width}
        height={height}
        loading={loading}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: 0,
          transition: 'opacity 0.2s',
          zIndex: 10,
          fontSize: '1.2rem'
        }}
        className="live-image-edit-btn"
        title="Edit Image"
      >
        📸
      </button>

      {isUploading && (
        <span style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--navy)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          zIndex: 10
        }}>
          Uploading...
        </span>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .live-image-container:hover .live-image-edit-btn {
          opacity: 1 !important;
        }
        .live-image-container {
          outline: 1px dashed transparent;
          transition: outline 0.2s;
        }
        .live-image-container:hover {
          outline-color: var(--gold);
        }
      `}} />
    </div>
  );
}
