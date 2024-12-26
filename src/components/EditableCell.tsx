import React, { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => Promise<void>;
  type?: 'text' | 'email' | 'url' | 'tel';
}

export function EditableCell({ value: initialValue, onChange, type = 'text' }: EditableCellProps) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = async () => {
    if (value !== initialValue) {
      setIsLoading(true);
      try {
        await onChange(value);
      } catch (error) {
        console.error('Failed to update value:', error);
        setValue(initialValue);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        className="w-full px-2 py-1 bg-white/10 border border-purple-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
    );
  }

  return (
    <div
      className="px-2 py-1 cursor-pointer hover:bg-white/5 rounded truncate"
      onDoubleClick={handleDoubleClick}
    >
      {value || <span className="text-gray-400 italic">Click to edit</span>}
    </div>
  );
}