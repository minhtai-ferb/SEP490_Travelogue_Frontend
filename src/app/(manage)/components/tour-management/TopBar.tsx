"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"

type TopBarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  onCreate: () => void
  totalCount: number
}

const statusOptions = [
  { key: "all", label: "Tất cả trạng thái" },
  { key: "Draft", label: "Nháp" },
  { key: "Confirmed", label: "Đã xác nhận" },
  { key: "Cancel", label: "Đã hủy" },
]

export function TopBar({ searchValue, onSearchChange, statusFilter, onStatusChange, onCreate, totalCount }: TopBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between gap-3 items-end">
        <div className="relative w-full sm:max-w-[44%]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo tên tour..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.key} value={status.key}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tạo chuyến tham quan mới
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Tổng cộng {totalCount} chuyến tham quan</span>
      </div>
    </div>
  )
}


