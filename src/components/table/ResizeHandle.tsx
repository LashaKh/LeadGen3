import React, { useState } from 'react';

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  isColumn?: boolean;
  minSize?: number;
  maxSize?: number;
}

export function ResizeHandle({ 
  onResize, 
  isColumn = true, 
  minSize = 50, 
  maxSize = 800 
}: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [currentSize, setCurrentSize] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition(isColumn ? e.clientX : e.clientY);
    setCurrentSize(isColumn ? e.currentTarget.parentElement?.offsetWidth || 0 : e.currentTarget.parentElement?.offsetHeight || 0);
    e.preventDefault();

    function handleMouseMove(e: MouseEvent) {
      if (isDragging) {
        const currentPosition = isColumn ? e.clientX : e.clientY;
        const delta = currentPosition - startPosition;
        const newSize = currentSize + delta;
        
        if (newSize >= minSize && newSize <= maxSize) {
          onResize(delta);
        }
        
        setStartPosition(currentPosition);
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`absolute ${
        isColumn 
          ? 'cursor-col-resize right-[-4px] top-0 w-2 h-full hover:bg-purple-500/20 active:bg-purple-500/40' 
          : 'cursor-row-resize bottom-[-4px] left-0 h-2 w-full hover:bg-purple-500/20 active:bg-purple-500/40'
      } border-purple-500 z-20 ${
        isDragging ? 'bg-purple-500/40' : ''
      } transition-colors`}
      onMouseDown={handleMouseDown}
    />
  );
}