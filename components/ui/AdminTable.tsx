"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Inbox, Plus } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T, index: number) => React.ReactNode);
  className?: string;
  width?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  onAddClick?: () => void;
  addLabel?: string;
  pageSize?: number;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export function AdminTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = "Search records...",
  searchFilter,
  onAddClick,
  addLabel = "Add Record",
  pageSize = 8,
  emptyTitle = "No records found",
  emptySubtitle = "Try adjusting your search or add a new entry.",
}: AdminTableProps<T>) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = searchFilter && query ? data.filter((item) => searchFilter(item, query)) : data;

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pageData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder={searchPlaceholder}
            className="admin-input pl-9 text-xs"
          />
        </div>

        {onAddClick && (
          <button type="button" onClick={onAddClick} className="admin-btn-primary">
            <Plus className="w-4 h-4" />
            <span>{addLabel}</span>
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={col.className} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, rowIdx) => (
                <tr key={keyExtractor(item, rowIdx)}>
                  {columns.map((col, colIdx) => {
                    let cellContent: React.ReactNode = null;
                    if (typeof col.accessor === "function") {
                      cellContent = col.accessor(item, rowIdx);
                    } else if (col.accessor) {
                      cellContent = (item[col.accessor] as unknown) as React.ReactNode;
                    }
                    return (
                      <td key={colIdx} className={col.className}>
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#71717A]">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-playfair text-base font-semibold text-[#0A0A0A] dark:text-[#F4F4F5]">
                        {emptyTitle}
                      </p>
                      <p className="text-xs text-[#71717A] mt-1">{emptySubtitle}</p>
                    </div>
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-xs font-semibold text-[#C5A059] hover:underline"
                      >
                        Clear Search Filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {filteredData.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2 text-xs text-[#71717A]">
          <div>
            Showing <span className="font-semibold text-[#0A0A0A] dark:text-[#F4F4F5]">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="font-semibold text-[#0A0A0A] dark:text-[#F4F4F5]">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{" "}
            <span className="font-semibold text-[#0A0A0A] dark:text-[#F4F4F5]">{filteredData.length}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md border border-[#E4E4E7] dark:border-[#27272A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-[#0A0A0A] dark:text-[#F4F4F5]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md border border-[#E4E4E7] dark:border-[#27272A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
