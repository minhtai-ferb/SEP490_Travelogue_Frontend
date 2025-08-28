"use client";

import { DataTable } from '@/components/table/data-table-user';
import { WorkshopDetail } from '@/types/Workshop'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipTrigger } from '@/components/tiptap-ui-primitive/tooltip';

type WorkshopTableProps = {
	items: WorkshopDetail[]
}

function WorkshopTable({ items }: WorkshopTableProps) {
	const router = useRouter()

	const handleDelete = (id: string) => {
		console.log(id)
	}

	const handleView = (id: string) => {
		router.push(`/craftvillage/dashboard/workshop/${id}`)
	}

	const columns: ColumnDef<WorkshopDetail>[] = [
		{
			header: 'Tên workshop',
			accessorKey: 'name',
		},
		{
			header: 'Mô tả',
			accessorKey: 'description',
		},
		{
			header: 'Trạng thái',
			accessorKey: 'status',
		},
		{
			header: 'Ngày tạo',
			accessorKey: 'createdAt',
		},
		{
			header: 'Ngày cập nhật',
			accessorKey: 'updatedAt',
		},
		{
			header: 'Hành động',
			cell: ({ row }) => {
				const id = (row.original as any)?.id
				return (
					<div className="flex gap-2">
						<Link href={`/craftvillage/dashboard/workshop/${id}/edit`}>
							<Button size="sm" variant="outline">Chỉnh sửa</Button>
						</Link>
						<Tooltip>
							<TooltipTrigger asChild content='Xóa'>
								<Button size="sm" variant="outline" onClick={() => handleDelete(id)}>
									<Trash2 />
								</Button>
							</TooltipTrigger>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild content='Xem'>
								<Button size="sm" variant="outline" onClick={() => handleView(id)}>
									<Eye />
								</Button>
							</TooltipTrigger>
						</Tooltip>
					</div >
				)
			},
		},
	]

	return (
		<DataTable columns={columns} data={items} />
	)
}

export default WorkshopTable
