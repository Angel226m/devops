 

import React from 'react';

interface Column {
  header: string;
  accessor: string | ((row: any) => React.ReactNode);
}

interface TableProps {
  columns: Column[];
  data: any[];  // Se espera que sea un array
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'No hay datos disponibles', 
  className = ''
}) => {
  // Renderizar valor de una celda
  const renderCell = (row: any, column: Column) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    
    // Manejar rutas anidadas como 'user.name'
    if (typeof column.accessor === 'string' && column.accessor.includes('.')) {
      const accessorParts = column.accessor.split('.');
      let value = row;
      for (const part of accessorParts) {
        value = value?.[part];
        if (value === undefined || value === null) break;
      }
      return value || '-';
    }
    
    return row[column.accessor] || '-';
  };
  
  // Verificar si está cargando
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Verificar si data es un array válido con elementos
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(data) ? data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renderCell(row, column)}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                Error: Los datos proporcionados no son un array.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;