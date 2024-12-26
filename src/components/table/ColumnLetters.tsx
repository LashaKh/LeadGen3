import React from 'react';

interface ColumnLettersProps {
  columns: number;
  onSelectAll: () => void;
}

export function ColumnLetters({ columns, onSelectAll }: ColumnLettersProps) {
  return (
    <tr className="select-none">
      <th 
        className="w-12 h-8 border-r border-b border-purple-900/30 sticky left-0 top-0 bg-[#0a061e]/95 backdrop-blur z-20 cursor-pointer hover:bg-purple-500/10"
        onClick={onSelectAll}
      />
      {Array.from({ length: columns }).map((_, index) => (
        <th
          key={index}
          className="h-8 px-2 border-r border-b border-purple-900/30 bg-[#0a061e]/95 backdrop-blur text-purple-500/50 text-sm font-medium text-center"
        >
          {String.fromCharCode(65 + index)}
        </th>
      ))}
    </tr>
  );
}