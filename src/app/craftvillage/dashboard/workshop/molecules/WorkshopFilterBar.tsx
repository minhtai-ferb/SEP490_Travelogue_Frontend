"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type Props = {
	status: string | number
	keyword: string
	onChangeStatus: (status: string | number) => void
	onChangeKeyword: (keyword: string) => void
	onSearch: () => void
	loading?: boolean
}

export default function WorkshopFilterBar({ status, keyword, onChangeStatus, onChangeKeyword, onSearch, loading }: Props) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
			<Input placeholder="Tìm kiếm" value={keyword} onChange={(e) => onChangeKeyword(e.target.value)} />
			<Select value={String(status)} onValueChange={(v) => onChangeStatus(v === "all" ? "all" : Number(v))}>
				<SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Tất cả</SelectItem>
					<SelectItem value="0">Nháp</SelectItem>
					<SelectItem value="1">Chờ duyệt</SelectItem>
					<SelectItem value="2">Đã duyệt</SelectItem>
					<SelectItem value="3">Bị từ chối</SelectItem>
				</SelectContent>
			</Select>
			<Button onClick={onSearch} disabled={loading}>Lọc</Button>
		</div>
	)
}


