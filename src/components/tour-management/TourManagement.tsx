"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTour } from "@/services/tour"
import type { TourDetail } from "@/types/Tour"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { DeleteTourDialog } from "./DeleteTourDialog"
import { ErrorCard } from "./ErrorCard"
import { PaginationBar } from "./PaginationBar"
import { TopBar } from "./TopBar"
import { ToursTable } from "./ToursTable"

function TourManagement() {
	const router = useRouter()
	const [tours, setTours] = useState<TourDetail[]>([])
	const [filteredTours, setFilteredTours] = useState<TourDetail[]>([])
	const [page, setPage] = useState(1)
	const [searchValue, setSearchValue] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [typeFilter] = useState("all")
	const [selectedTour, setSelectedTour] = useState<TourDetail | null>(null)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [actionLoading, setActionLoading] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)

	const rowsPerPage = 10
	const pages = Math.ceil(filteredTours.length / rowsPerPage)

	const { getAllTour, deleteTour } = useTour()

	const fetchAllTours = async () => {
		try {
			setError("")
			setLoading(true)
			const response = await getAllTour()
			const sortedTours = response?.sort((a: any, b: any) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
			setTours(sortedTours)
			setFilteredTours(sortedTours)
		} catch (error) {
			setError("Có lỗi khi tải dữ liệu")
			console.error("Lỗi fetch tours", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAllTours()
	}, [])

	useEffect(() => {
		let filtered = tours

		if (searchValue) {
			filtered = filtered.filter(
				(tour) =>
					tour.name.toLowerCase().includes(searchValue.toLowerCase()) ||
					tour.description.toLowerCase().includes(searchValue.toLowerCase()),
			)
		}

		// Status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((tour) => tour.statusText === statusFilter)
		}

		// Type filter
		if (typeFilter !== "all") {
			filtered = filtered.filter((tour) => tour.tourTypeText === typeFilter)
		}

		setFilteredTours(filtered)
		setPage(1) // Reset to first page when filtering
	}, [tours, searchValue, statusFilter, typeFilter])

	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage
		return filteredTours.slice(start, end)
	}, [page, filteredTours])

	// Actions
	const handleView = (tour: TourDetail) => {
		router.push(`/admin/tour/${tour.tourId}`)
	}

	const handleEdit = (tour: TourDetail) => {
		router.push(`/admin/tour/${tour.tourId}/edit`)
	}

	const handleDelete = (tour: TourDetail) => {
		setSelectedTour(tour)
		setIsDeleteOpen(true)
	}

	const handleCreate = () => {
		router.push("/admin/tour/create")
	}

	const handleConfirmDelete = async () => {
		if (!selectedTour) return

		try {
			setActionLoading(true)
			await deleteTour(selectedTour.tourId)
			await fetchAllTours()
			setIsDeleteOpen(false)
			setSelectedTour(null)
		} catch (error) {
			console.error("Error deleting tour:", error)
			setError("Có lỗi khi xóa tour")
		} finally {
			setActionLoading(false)
		}
	}

	// Render logic moved into ToursTable

	if (error) {
		return <ErrorCard message={error} onRetry={fetchAllTours} />
	}

	return (
		<div className="p-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Quản Lý Chuyến Tham Quan</CardTitle>
				</CardHeader>
				<CardContent>
					<TopBar
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						statusFilter={statusFilter}
						onStatusChange={setStatusFilter}
						onCreate={handleCreate}
						totalCount={filteredTours.length}
					/>

					<ToursTable items={items} loading={loading} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />

					<PaginationBar
						page={page}
						pages={pages}
						pageSize={rowsPerPage}
						totalCount={filteredTours.length}
						onPageChange={setPage}
					/>
				</CardContent>
			</Card>

			<DeleteTourDialog
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				tour={selectedTour}
				isLoading={actionLoading}
				onConfirm={handleConfirmDelete}
				onCancel={() => setIsDeleteOpen(false)}
			/>
		</div>
	)
}

export default TourManagement
