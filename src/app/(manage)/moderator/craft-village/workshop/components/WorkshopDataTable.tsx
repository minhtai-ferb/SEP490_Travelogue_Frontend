'use client'

import { DataTable } from "@/app/admin/user/table/components/data-table-user"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Loader2 } from "lucide-react"

type WorkshopRow = {
	id: string
	name: string
	description: string
	status: number | string
	statusText?: string
	craftVillageName?: string
}

const columns: ColumnDef<WorkshopRow>[] = [
	{
		header: "Tên workshop",
		accessorKey: "name",
		cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
	},
	{
		header: "Mô tả",
		accessorKey: "description",
		cell: ({ row }) => <span className="text-gray-600 line-clamp-2 max-w-[480px] block">{row.original.description}</span>,
	},
	{
		header: "Làng nghề",
		accessorKey: "craftVillageName",
	},
	{
		header: "Trạng thái",
		accessorKey: "statusText",
		cell: ({ row }) => <span>{row.original.statusText || row.original.status}</span>,
	},
	{
		header: "Hành động",
		accessorKey: "action",
		cell: ({ row }) => <div className="flex justify-end">
			<Button variant="outline" size="sm" className="flex items-center gap-2">
				<Eye className="w-4 h-4" />
				Xem
			</Button>
		</div>,
	},
]

interface WorkshopDataTableProps {
	workshops: any[]
	loading: boolean
}

function WorkshopDataTable({ workshops, loading }: WorkshopDataTableProps) {
	if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-4 h-4 animate-spin" /></div>
	const rows: WorkshopRow[] = (workshops || []).map((w: any) => ({
		id: w.id,
		name: w.name,
		description: w.description,
		status: w.status,
		statusText: w.statusText,
		craftVillageName: w.craftVillageName,
		craftVillageId: w.craftVillageId,
	}))
	return <DataTable columns={columns} data={rows} />
}

export default WorkshopDataTable
