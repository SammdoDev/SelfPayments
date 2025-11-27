'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import '../../styles/table-dark.css';

export interface TableHeader<T> {
  value: keyof T;
  title: string;
  width?: string;
}

interface CustomTableProps<T extends DataTableValue> {
  data: T[];
  tableHeaders: TableHeader<T>[];
  renderCell?: (rowData: T, field: keyof T) => React.ReactNode;
  rows?: number;
  responsiveLayout?: 'scroll' | 'stack';
  className?: string;
}

export function CustomTable<T extends DataTableValue>({
  data,
  tableHeaders,
  renderCell,
  rows = 10,
  responsiveLayout = 'scroll',
  className = '',
}: CustomTableProps<T>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () =>
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`custom-table-container ${isDarkMode ? 'dark-mode' : 'light-mode'} ${className}`}
    >
      <div className="table-inner">
        <DataTable
          value={data}
          rows={rows}
          responsiveLayout={responsiveLayout}
          className="p-datatable-sm custom-table w-full rounded-lg overflow-hidden"
        >
          {tableHeaders.map((col, idx) => (
            <Column
              key={idx}
              field={col.value as string}
              header={col.title}
              style={{ width: col.width }}
              body={(rowData) =>
                renderCell
                  ? renderCell(rowData, col.value)
                  : (rowData as any)[col.value]
              }
            />
          ))}
        </DataTable>
      </div>
    </div>
  );
}
