'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from './AdminProvider';
import { createClient } from '@/lib/supabase/client';

interface LiveTextProps {
  contentKey: string;
  initialValue: string;
  tagName?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export default function LiveText({ contentKey, initialValue, tagName = 'span', className = '', style }: LiveTextProps) {
  const { isAdmin } = useAdmin();
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const textRef = useRef<HTMLElement>(null);
  const Tag = tagName as any;

  // Sync internal state if initialValue changes (e.g. from server)
  useEffect(() => {
    if (!textRef.current || textRef.current.innerText !== initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const handleBlur = async (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.currentTarget.innerText;
    if (newValue === value) return; // No change

    setIsSaving(true);
    setValue(newValue);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('site_content')
        .update({ content_value: newValue, updated_at: new Date().toISOString() })
        .eq('content_key', contentKey);
      
      if (error) throw error;
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save inline edit:', err);
      alert('Failed to save edit.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      textRef.current?.blur(); // Triggers save
    }
  };

  if (!isAdmin) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  return (
    <span style={{ position: 'relative', display: tagName === 'span' ? 'inline-block' : 'block' }}>
      <Tag
        ref={textRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} live-editable`}
        style={{
          ...style,
          outline: 'none',
          cursor: 'text',
          borderBottom: '1px dashed rgba(212, 175, 55, 0.5)',
          minWidth: '20px',
          display: 'inline-block',
        }}
      >
        {value}
      </Tag>
      
      {isSaving && (
        <span style={{ position: 'absolute', top: '-20px', right: 0, fontSize: '10px', color: '#888', background: '#fff', padding: '2px 4px', borderRadius: '4px', border: '1px solid #ddd', whiteSpace: 'nowrap', zIndex: 10 }}>Saving...</span>
      )}
      {isSaved && (
        <span style={{ position: 'absolute', top: '-20px', right: 0, fontSize: '10px', color: '#10b981', background: '#fff', padding: '2px 4px', borderRadius: '4px', border: '1px solid #10b981', whiteSpace: 'nowrap', zIndex: 10 }}>Saved</span>
      )}
    </span>
  );
}
