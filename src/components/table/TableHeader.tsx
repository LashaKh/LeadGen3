import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ResizeHandle } from './ResizeHandle';

interface TableHeaderProps {
  label: string;
  icon?: LucideIcon;
  width: number;
  onResize: (delta: number) => void;
}

export function TableHeader({ label, icon: Icon, width, onResize }: TableHeaderProps) {
  return (
    <th 
      className="relative py-2 px-3 text-left text-sm font-semibold text-purple-400 border-r border-b border-purple-900/30 sticky top-8 bg-[#0a061e]/95 backdrop-blur select-none transition-all duration-75"
      style={{ width }}
    >
      <div className="flex items-center gap-1">
        {Icon && <Icon className="h-4 w-4" />}
        <span>{label}</span>
      </div>
      <ResizeHandle onResize={onResize} isColumn={true} minSize={100} maxSize={600} />
    </th>
  );
}