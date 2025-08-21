"use client";

import { DataTable } from '@/app/(manage)/admin/user/table/components/data-table-user';
import { WorkshopDetail } from '@/types/Workshop'
import { ColumnDef } from '@tanstack/react-table'

type WorkshopTableProps = {
	items: WorkshopDetail[]
}

function WorkshopTable({ items }: WorkshopTableProps) {

	const columns: ColumnDef<WorkshopDetail>[] = [
		{
			header: 'ID',
			accessorKey: 'id',
		},
		{
			header: 'Tên',
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
	]

	return (
		<div>
			<DataTable columns={columns} data={items} />
		</div>
	)
}

export default WorkshopTable
