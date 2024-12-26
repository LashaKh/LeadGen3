import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { ResizeHandle } from './ResizeHandle';

interface TableCellProps {
  value: string;
  rowIndex: number;
  colIndex: number;
  width: number;
  height: number;
  isSelected: boolean;
  isEditing: boolean;
  type?: 'text' | 'email' | 'url' | 'tel';
  onSelect: (rowIndex: number, colIndex: number, isShiftKey: boolean) => void;
  onChange: (value: string) => Promise<void>;
  onEditStart: () => void;
  onEditEnd: () => void;
  onRowResize: (delta: number) => void;
}

export function TableCell({
  value: initialValue,
  rowIndex,
  colIndex,
  width,
  height,
  isSelected,
  isEditing,
  type = 'text',
  onSelect,
  onChange,
  onEditStart,
  onEditEnd,
  onRowResize
}: TableCellProps) {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    onSelect(rowIndex, colIndex, e.shiftKey);
  };

  const handleDoubleClick = () => {
    onEditStart();
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
    onEditEnd();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      onEditEnd();
    }
  };

  return (
    <td 
      className={cn(
        "relative border-r border-b border-purple-900/30 group transition-all duration-75",
        isSelected && "bg-purple-500/20",
        !isEditing && "hover:bg-purple-500/10"
      )}
      style={{ width, height }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="relative h-full flex items-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type={type}
            className="w-full h-full px-2 py-1 bg-white/10 border-2 border-purple-500 focus:outline-none rounded-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        ) : (
          <div className="px-2 py-1 h-full w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {value || <span className="text-gray-400 italic">Empty</span>}
          </div>
        )}
        <ResizeHandle onResize={onRowResize} isColumn={false} minSize={32} maxSize={400} />
      </div>
    </td>
  );
}