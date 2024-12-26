import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link as LinkIcon, Mail, Phone, Facebook, Instagram, Twitter, Trash2 } from 'lucide-react';
import { TableCell } from './table/TableCell';
import { TableHeader } from './table/TableHeader';
import { TableRowHeader } from './table/TableRowHeader';
import { ColumnLetters } from './table/ColumnLetters';
import { isInRange } from '../lib/utils';

interface Lead {
  id: string;
  company_name: string;
  website: string;
  description: string;
  company_address: string;
  company_linkedin: string;
  company_email: string;
  company_email_2: string;
  company_facebook: string;
  company_instagram: string;
  company_twitter: string;
  company_phone: string;
  company_phone_2: string;
  created_at: string;
  last_updated: string;
}
const COLUMNS = [
  { key: 'company_name', label: 'Company', type: 'text' },
  { key: 'company_address', label: 'Address', type: 'text' },
  { key: 'description', label: 'Description', type: 'text' },
  { key: 'company_linkedin', label: 'LinkedIn', type: 'url', icon: LinkIcon },
  { key: 'company_email', label: 'Email', type: 'email', icon: Mail },
  { key: 'company_email_2', label: 'Email 2', type: 'email', icon: Mail },
  { key: 'company_facebook', label: 'Facebook', type: 'url', icon: Facebook },
  { key: 'company_instagram', label: 'Instagram', type: 'url', icon: Instagram },
  { key: 'company_twitter', label: 'Twitter', type: 'url', icon: Twitter },
  { key: 'company_phone', label: 'Phone', type: 'tel', icon: Phone },
  { key: 'company_phone_2', label: 'Phone 2', type: 'tel', icon: Phone },
] as const;

export default function LeadsDataTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [columnWidths, setColumnWidths] = useState<number[]>(
    COLUMNS.map(() => 150)
  );
  const [rowHeights, setRowHeights] = useState<number[]>(
    Array(20).fill(32)  // Default height for rows
  );

  const handleRowResize = (index: number, delta: number) => {
    setRowHeights(heights => {
      const newHeights = [...heights];
      newHeights[index] = Math.max(32, newHeights[index] + delta);
      return newHeights;
    });
  };
  const [editingCell, setEditingCell] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSelectAll = () => {
    const allCells: [number, number][] = [];
    for (let r = 0; r < leads.length; r++) {
      for (let c = 0; c < COLUMNS.length; c++) {
        allCells.push([r, c]);
      }
    }
    setSelectedCells(allCells);
  };

  const handleColumnResize = (index: number, delta: number) => {
    setColumnWidths(widths => {
      const newWidths = [...widths];
      newWidths[index] = Math.max(100, newWidths[index] + delta);
      return newWidths;
    });
  };

  const handleCellSelect = (rowIndex: number, colIndex: number, isShiftKey: boolean) => {
    if (!isShiftKey) {
      setSelectedCells([[rowIndex, colIndex]]);
      return;
    }

    if (selectedCells.length === 0) {
      setSelectedCells([[rowIndex, colIndex]]);
      return;
    }

    const [startRow, startCol] = selectedCells[0];
    const newSelection: [number, number][] = [];

    for (let r = 0; r < leads.length; r++) {
      for (let c = 0; c < COLUMNS.length; c++) {
        if (isInRange(r, startRow, rowIndex) && isInRange(c, startCol, colIndex)) {
          newSelection.push([r, c]);
        }
      }
    }

    setSelectedCells(newSelection);
  };

  const handleRowSelect = (rowIndex: number) => {
    const rowSelection: [number, number][] = [];
    for (let c = 0; c < COLUMNS.length; c++) {
      rowSelection.push([rowIndex, c]);
    }
    setSelectedCells(rowSelection);
  };

  const handleDelete = async () => {
    if (selectedCells.length === 0) return;

    const rowsToDelete = [...new Set(selectedCells.map(([row]) => leads[row].id))];
    
    try {
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .in('id', rowsToDelete);

      if (deleteError) throw deleteError;

      setLeads(current => current.filter(lead => !rowsToDelete.includes(lead.id)));
      setSelectedCells([]);
    } catch (error) {
      console.error('Error deleting leads:', error);
      setError('Failed to delete leads');
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    fetchLeads();
    
    const subscription = supabase
      .channel('leads_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, 
        payload => {
          setLeads(current => [...current, payload.new as Lead]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchLeads() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (id: string, field: keyof Lead, value: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;

      setLeads(current =>
        current.map(lead =>
          lead.id === id ? { ...lead, [field]: value } : lead
        )
      );
    } catch (error) {
      console.error('Error updating lead:', error);
      setError('Failed to update lead');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent"></div>
        <p className="mt-4 text-gray-400">Loading leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No leads generated yet. Generate some leads to see them here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {selectedCells.length > 0 && (
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
            Delete selected
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}
        <table className="min-w-full divide-y divide-purple-900/30">
          <thead>
            <ColumnLetters
              columns={COLUMNS.length}
              onSelectAll={handleSelectAll}
            />
            <tr>
              <th className="w-12 py-2 border-r border-b border-purple-900/30 sticky left-0 top-0 bg-[#0a061e]/95 backdrop-blur z-10" />
              {COLUMNS.map(({ key, label, icon: Icon }, index) => (
                <TableHeader
                  key={key}
                  label={label}
                  icon={Icon}
                  width={columnWidths[index]}
                  onResize={(delta) => handleColumnResize(index, delta)}
                />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/30">
            {leads.map((lead, rowIndex) => (
              <tr key={lead.id} className="hover:bg-purple-500/5">
                <TableRowHeader
                  index={rowIndex}
                  isSelected={selectedCells.some(([row]) => row === rowIndex)}
                  onClick={() => handleRowSelect(rowIndex)}
                />
                {COLUMNS.map(({ key, type }, colIndex) => (
                  <TableCell
                    key={key}
                    value={lead[key as keyof Lead] || ''}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    width={columnWidths[colIndex]}
                    height={rowHeights[rowIndex]}
                    isSelected={selectedCells.some(([row, col]) => row === rowIndex && col === colIndex)}
                    isEditing={editingCell?.[0] === rowIndex && editingCell?.[1] === colIndex}
                    onChange={(value) => handleUpdate(lead.id, key as keyof Lead, value)}
                    onSelect={handleCellSelect}
                    onEditStart={() => setEditingCell([rowIndex, colIndex])}
                    onEditEnd={() => setEditingCell(null)}
                    onRowResize={(delta) => handleRowResize(rowIndex, delta)}
                    type={type}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}