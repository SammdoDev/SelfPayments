'use client';

import React from 'react';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';

type TablePaginatorProps = {
   count: number;
   countLoading: boolean;
   limit: number;
   page: number;
   pageChange: (event: any, page: number) => void;
   rowsChange: (rows: any) => void;
};

const TablePaginator: React.FC<TablePaginatorProps> = ({
   count = -99,
   countLoading = false,
   limit = 50,
   page = 0,
   pageChange,
   rowsChange
}) => {
   const rowsPerPageOptions = [
      { label: '50', value: 50 },
      { label: '75', value: 75 },
      { label: '100', value: 100 }
   ];

   const handlePageChange = (e: PaginatorPageChangeEvent) => {
      pageChange(e, e.page);
   };

   const handleRowsChange = (e: any) => {
      rowsChange(e.value);
   };

   const from = count === 0 ? 0 : page * limit + 1;
   const to = Math.min((page + 1) * limit, count === -99 ? 0 : count);

   return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2 border-t border-gray-200">
         <div className="text-sm text-gray-600 flex items-center gap-1">
            {from}–{to} of{' '}
            {countLoading ? (
               <ProgressSpinner style={{ width: '14px', height: '14px' }} strokeWidth="8" />
            ) : (
               count === -99 ? 0 : count
            )}
         </div>

         <div className="flex items-center gap-2">
            <Dropdown
               value={limit}
               options={rowsPerPageOptions}
               onChange={handleRowsChange}
               optionLabel="label"
               optionValue="value"
               className="w-24"
            />
            <Paginator
               first={page * limit}
               rows={limit}
               totalRecords={count === -99 ? 0 : count}
               onPageChange={handlePageChange}
               template="PrevPageLink PageLinks NextPageLink"
               className="p-paginator-sm"
            />
         </div>
      </div>
   );
};

export default TablePaginator;
