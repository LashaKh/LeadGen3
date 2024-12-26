import React from 'react';

interface TableRowHeaderProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export function TableRowHeader({ index, isSelected, onClick }: TableRowHeaderProps) {
  return (
    <td 
      className={`w-12 text-center text-sm border-r border-b border-purple-900/30 sticky left-0 
        ${isSelected ? 'bg-purple-500/20' : 'bg-[#0a061e]/95 hover:bg-purple-500/10'} 
        backdrop-blur cursor-pointer`}
      onClick={onClick}
    >
      {index + 1}
    </td>
  );
}