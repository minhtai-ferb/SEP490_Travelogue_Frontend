import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTourguideAssign } from '@/services/tourguide'
import { RejectionRequestDetail } from '@/types/Tourguide'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
interface DataTableProps {
	columns: ColumnDef<RejectionRequestDetail>[]
	data: RejectionRequestDetail[]
	loading: boolean
	total: number
	page: number
	pageSize: number
	onPageChange: (page: number) => void
	onPageSizeChange: (pageSize: number) => void
}

function DataTable({ columns, data, loading, total, page, pageSize, onPageChange, onPageSizeChange }: DataTableProps) {
	const { getTourguideProfile } = useTourguideAssign()

	const [guideById, setGuideById] = useState<Record<string, { name: string; email: string }>>({})

	useEffect(() => {
		const ids = Array.from(new Set(data.map(d => d.tourGuideId).filter(Boolean) as string[]))
		const missing = ids.filter(id => !(id in guideById))
		if (missing.length === 0) return
		let cancelled = false

			; (async () => {
				const entries = await Promise.all(missing.map(async (id) => {
					try {
						const p = await getTourguideProfile(id)
						console.log("ppppp", p)
						return [id, {
							name: p?.userName ?? p?.fullName ?? p?.name ?? p?.email ?? id,
							email: p?.email ?? ''
						}] as any
					} catch {
						return [id, { name: id, email: '' }] as any
					}
				}))
				if (!cancelled) {
					setGuideById(prev => {
						const next = { ...prev }
						entries.forEach(([id, info]) => { next[id] = info })
						return next
					})
				}
			})()

		return () => { cancelled = true }
	}, [data, getTourguideProfile])

	return (
		<div>
			<div className="flex justify-between items-center">
				<div className="text-sm text-gray-500">
					Total: {total}
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((column, idx) => (
							<TableHead key={(column as any).accessorKey ?? column.id ?? idx}>
								{typeof column.header === 'string' ? column.header : null}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				{loading ? (
					<TableBody>
						<TableRow>
							<TableCell colSpan={columns.length} className="text-center">
								<Loader2 className="w-4 h-4 animate-spin" />
							</TableCell>
						</TableRow>
					</TableBody>
				) : (
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground">Không có dữ liệu</TableCell>
							</TableRow>
						) : (
							data.map((item) => (
								<TableRow key={item.id}>
									{columns.map((column, cidx) => {
										const key = (column as any).accessorKey as string | undefined
										const value = key ? (item as any)[key] : undefined
										let content: any = value
										if (typeof (column as any).cell === 'function') {
											try {
												content = (column as any).cell({ row: { original: item }, getValue: () => value })
											} catch {
												content = value
											}
										}
										if (key === 'tourGuideId') content = guideById[value]?.name ?? value
										if (key === 'tourGuideEmail') content = guideById[value]?.email ?? ''
										return (
											<TableCell key={key ?? column.id ?? cidx}>{content ?? ''}</TableCell>
										)
									})}
								</TableRow>
							))
						)}
					</TableBody>
				)}
			</Table>
		</div >
	)
}
export default DataTable