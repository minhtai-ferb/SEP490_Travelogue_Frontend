"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationBarProps = {
  page: number;
  pages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

export function PaginationBar({
  page,
  pages,
  pageSize,
  totalCount,
  onPageChange,
}: PaginationBarProps) {
  if (pages <= 1) return null;

  const start = totalCount > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-col justify-center items-center mt-2 space-y-2">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className={
                page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>
          {Array.from({ length: Math.min(5, pages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => onPageChange(pageNum)}
                  isActive={page === pageNum}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(pages, page + 1))}
              className={
                page === pages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div>
        <span className="text-sm text-gray-500 w-fit">
          {totalCount > 0 ? `${start}-${end} của ${totalCount}` : "0 tour"}
        </span>
      </div>
    </div>
  );
}
