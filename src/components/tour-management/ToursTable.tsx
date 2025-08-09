"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TourDetail } from "@/types/Tour"
import { StatusBadge } from "./StatusBadge"
import { RowActions } from "./RowActions"

type ToursTableProps = {
  items: TourDetail[]
  loading: boolean
  onView: (tour: TourDetail) => void
  onEdit: (tour: TourDetail) => void
  onDelete: (tour: TourDetail) => void
}

const columns = [
  { name: "Tên Tour", uid: "name" },
  { name: "Loại Tour", uid: "tourTypeText" },
  { name: "Thời Gian", uid: "totalDaysText" },
  { name: "Giá Người Lớn", uid: "adultPrice" },
  { name: "Giá Trẻ Em", uid: "childrenPrice" },
  { name: "Trạng Thái", uid: "statusText" },
  { name: "Hành Động", uid: "actions" },
]

function renderCell(
  tour: TourDetail,
  columnKey: string,
  handlers: Pick<ToursTableProps, "onView" | "onEdit" | "onDelete">
) {
  switch (columnKey) {
    case "name":
      return (
        <div className="flex flex-col">
          <p className="font-medium text-sm">{tour.name}</p>
          <p className="text-sm text-gray-500">{tour.description?.substring(0, 50)}...</p>
        </div>
      )
    case "tourTypeText":
      return <span className="text-sm">{tour.tourTypeText}</span>
    case "totalDaysText":
      return <span className="text-sm">{tour.totalDaysText}</span>
    case "adultPrice":
      return <span className="text-sm font-semibold text-green-600">{tour.adultPrice?.toLocaleString()} VNĐ</span>
    case "childrenPrice":
      return <span className="text-sm font-semibold text-blue-600">{tour.childrenPrice?.toLocaleString()} VNĐ</span>
    case "statusText":
      return <StatusBadge statusText={tour.statusText} />
    case "actions":
      return <RowActions tour={tour} onView={handlers.onView} onEdit={handlers.onEdit} onDelete={handlers.onDelete} />
    default:
      return (tour as any)[columnKey]
  }
}

export function ToursTable({ items, loading, onView, onEdit, onDelete }: ToursTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.uid} className={column.uid === "actions" ? "text-center" : ""}>
                {column.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                Đang tải...
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                Không có tour nào
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.tourId}>
                {columns.map((column) => (
                  <TableCell key={column.uid}>
                    {renderCell(item, column.uid, { onView, onEdit, onDelete })}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}


