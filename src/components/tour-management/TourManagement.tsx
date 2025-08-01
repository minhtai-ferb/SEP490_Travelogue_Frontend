"use client"
import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { ChipProps } from "@heroui/react"
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Chip,
	Tooltip,
	Pagination,
	Button,
	Input,
	Select,
	SelectItem,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Card,
	CardBody,
	CardHeader,
} from "@heroui/react"
import { DeleteIcon, EditIcon, EyeIcon, PlusIcon, SearchIcon } from "@/utils/icon"
import type { Tour, CreateTourRequest, UpdateTourRequest } from "@/types/Tour"
import { useTour } from "@/services/tour"
import { TourForm } from "./TourForm"
import { TourDetails } from "./TourDetail"
import { DeleteConfirmation } from "./DeleteConfirmation"
import { TourWizard } from "./TourWizard"

const columns = [
	{ name: "Tên Tour", uid: "name" },
	{ name: "Loại Tour", uid: "tourTypeText" },
	{ name: "Thời Gian", uid: "totalDaysText" },
	{ name: "Giá Người Lớn", uid: "adultPrice" },
	{ name: "Giá Trẻ Em", uid: "childrenPrice" },
	{ name: "Trạng Thái", uid: "statusText" },
	{ name: "Hành Động", uid: "actions" },
]

const statusColorMap: Record<string, ChipProps["color"]> = {
	Draft: "warning",
	Published: "success",
	Active: "primary",
	Cancelled: "danger",
}

const statusOptions = [
	{ key: "all", label: "Tất cả trạng thái" },
	{ key: "Draft", label: "Nháp" },
	{ key: "Published", label: "Đã xuất bản" },
	{ key: "Active", label: "Hoạt động" },
	{ key: "Cancelled", label: "Đã hủy" },
]

const tourTypeOptions = [
	{ key: "all", label: "Tất cả loại tour" },
	{ key: "Du lịch trong nước", label: "Du lịch trong nước" },
	{ key: "Du lịch nước ngoài", label: "Du lịch nước ngoài" },
	{ key: "Tour phiêu lưu", label: "Tour phiêu lưu" },
	{ key: "Tour văn hóa", label: "Tour văn hóa" },
	{ key: "Tour thiên nhiên", label: "Tour thiên nhiên" },
	{ key: "Tour lịch sử", label: "Tour lịch sử" },
]

function TourManagement() {
	const [tours, setTours] = useState<Tour[]>([])
	const [filteredTours, setFilteredTours] = useState<Tour[]>([])
	const [page, setPage] = useState(1)
	const [searchValue, setSearchValue] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [typeFilter, setTypeFilter] = useState("all")
	const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [actionLoading, setActionLoading] = useState(false)

	const rowsPerPage = 10
	const pages = Math.ceil(filteredTours.length / rowsPerPage)

	const { getAllTour, createTour, updateTour, deleteTour } = useTour()

	// Modal controls
	const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
	const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
	const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
	const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
	const { isOpen: isWizardOpen, onOpen: onWizardOpen, onClose: onWizardClose } = useDisclosure()

	const fetchAllTours = async () => {
		try {
			setError("")
			setLoading(true)
			const response = await getAllTour()
			setTours(response || [])
			setFilteredTours(response || [])
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

	// Filter tours based on search and filters
	useEffect(() => {
		let filtered = tours

		// Search filter
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
	const handleView = (tour: Tour) => {
		setSelectedTour(tour)
		onViewOpen()
	}

	const handleEdit = (tour: Tour) => {
		setSelectedTour(tour)
		onEditOpen()
	}

	const handleDelete = (tour: Tour) => {
		setSelectedTour(tour)
		onDeleteOpen()
	}

	const handleWizardComplete = () => {
		fetchAllTours()
	}

	const handleCreate = async (data: Partial<CreateTourRequest>) => {
		try {
			setActionLoading(true)
			await createTour(data as CreateTourRequest)
			await fetchAllTours()
			onCreateClose()
		} catch (error) {
			console.error("Error creating tour:", error)
			setError("Có lỗi khi tạo tour")
		} finally {
			setActionLoading(false)
		}
	}

	const handleUpdate = async (data: Partial<UpdateTourRequest>) => {
		if (!selectedTour) return

		try {
			setActionLoading(true)
			// await updateTour({ ...data, tourId: selectedTour.tourId } as UpdateTourRequest)
			await fetchAllTours()
			onEditClose()
			setSelectedTour(null)
		} catch (error) {
			console.error("Error updating tour:", error)
			setError("Có lỗi khi cập nhật tour")
		} finally {
			setActionLoading(false)
		}
	}

	const handleConfirmDelete = async () => {
		if (!selectedTour) return

		try {
			setActionLoading(true)
			await deleteTour(selectedTour.tourId)
			await fetchAllTours()
			onDeleteClose()
			setSelectedTour(null)
		} catch (error) {
			console.error("Error deleting tour:", error)
			setError("Có lỗi khi xóa tour")
		} finally {
			setActionLoading(false)
		}
	}

	const renderCell = useCallback((tour: Tour, columnKey: string) => {
		switch (columnKey) {
			case "name":
				return (
					<div className="flex flex-col">
						<p className="text-bold text-sm capitalize">{tour.name}</p>
						<p className="text-bold text-sm capitalize text-default-400">{tour.description?.substring(0, 50)}...</p>
					</div>
				)
			case "tourTypeText":
				return <span className="text-sm">{tour.tourTypeText}</span>
			case "totalDaysText":
				return <span className="text-sm">{tour.totalDaysText}</span>
			case "adultPrice":
				return <span className="text-sm font-semibold text-success">{tour.adultPrice?.toLocaleString()} VNĐ</span>
			case "childrenPrice":
				return <span className="text-sm font-semibold text-primary">{tour.childrenPrice?.toLocaleString()} VNĐ</span>
			case "statusText":
				return (
					<Chip size="sm" variant="flat" color={statusColorMap[tour.statusText] || "default"}>
						{tour.statusText}
					</Chip>
				)
			case "actions":
				return (
					<div className="flex items-center justify-center gap-2">
						<Tooltip content="Xem chi tiết">
							<span
								onClick={() => handleView(tour)}
								className="cursor-pointer text-lg text-default-400 hover:text-default-600"
							>
								<EyeIcon />
							</span>
						</Tooltip>
						<Tooltip content="Chỉnh sửa">
							<span
								onClick={() => handleEdit(tour)}
								className="cursor-pointer text-lg text-default-400 hover:text-default-600"
							>
								<EditIcon />
							</span>
						</Tooltip>
						<Tooltip color="danger" content="Xóa tour">
							<span
								onClick={() => handleDelete(tour)}
								className="text-lg text-danger cursor-pointer hover:text-danger-600"
							>
								<DeleteIcon />
							</span>
						</Tooltip>
					</div>
				)
			default:
				return tour[columnKey as keyof Tour] as React.ReactNode
		}
	}, [])

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Tìm kiếm theo tên tour..."
						startContent={<SearchIcon />}
						value={searchValue}
						onClear={() => setSearchValue("")}
						onValueChange={setSearchValue}
					/>
					<div className="flex gap-3">
						<Select
							placeholder="Lọc theo trạng thái"
							className="max-w-xs"
							selectedKeys={[statusFilter]}
							onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
						>
							{statusOptions.map((status) => (
								<SelectItem key={status.key} textValue={status.key}>
									{status.label}
								</SelectItem>
							))}
						</Select>
						<Select
							placeholder="Lọc theo loại tour"
							className="max-w-xs"
							selectedKeys={[typeFilter]}
							onSelectionChange={(keys) => setTypeFilter(Array.from(keys)[0] as string)}
						>
							{tourTypeOptions.map((type) => (
								<SelectItem key={type.key} textValue={type.key}>
									{type.label}
								</SelectItem>
							))}
						</Select>
						<Button color="primary" endContent={<PlusIcon />} onPress={onWizardOpen}>
							Tạo Tour Mới
						</Button>
					</div>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-default-400 text-small">Tổng cộng {filteredTours.length} tour</span>
				</div>
			</div>
		)
	}, [searchValue, statusFilter, typeFilter, filteredTours.length, onWizardOpen])

	const bottomContent = useMemo(() => {
		return (
			<div className="py-2 px-2 flex justify-between items-center">
				<span className="w-[30%] text-small text-default-400">
					{filteredTours.length > 0
						? `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, filteredTours.length)} của ${filteredTours.length}`
						: "0 tour"}
				</span>
				<Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
			</div>
		)
	}, [page, pages, filteredTours.length])

	if (error) {
		return (
			<Card className="max-w-md mx-auto mt-8">
				<CardBody className="text-center">
					<p className="text-danger mb-4">{error}</p>
					<Button color="primary" onPress={fetchAllTours}>
						Thử lại
					</Button>
				</CardBody>
			</Card>
		)
	}

	return (
		<div className="p-6">
			<Card>
				<CardHeader>
					<h1 className="text-2xl font-bold">Quản Lý Tour</h1>
				</CardHeader>
				<CardBody>
					<Table
						aria-label="Bảng quản lý tour"
						isHeaderSticky
						bottomContent={bottomContent}
						bottomContentPlacement="outside"
						classNames={{
							wrapper: "max-h-[382px]",
						}}
						topContent={topContent}
						topContentPlacement="outside"
						onLoad={() => fetchAllTours()}
					>
						<TableHeader columns={columns}>
							{(column) => (
								<TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody items={items} emptyContent="Không có tour nào">
							{(item) => (
								<TableRow key={item.tourId}>
									{(columnKey) => <TableCell>{renderCell(item, columnKey as string)}</TableCell>}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			{/* Tour Creation Wizard */}
			<TourWizard isOpen={isWizardOpen} onClose={onWizardClose} onComplete={handleWizardComplete} />

			{/* Edit Tour Modal */}
			<Modal isOpen={isEditOpen} onClose={onEditClose} size="3xl" scrollBehavior="inside">
				<ModalContent>
					<ModalHeader>Chỉnh Sửa Tour</ModalHeader>
					<ModalBody>
						<TourForm tour={selectedTour} onSubmit={handleUpdate} onCancel={onEditClose} isLoading={actionLoading} />
					</ModalBody>
				</ModalContent>
			</Modal>

			{/* View Tour Modal */}
			<Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl" scrollBehavior="inside">
				<ModalContent>
					<ModalHeader>Chi Tiết Tour</ModalHeader>
					<ModalBody>{selectedTour && <TourDetails tour={selectedTour} />}</ModalBody>
					<ModalFooter>
						<Button color="danger" variant="light" onPress={onViewClose}>
							Đóng
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
				<ModalContent>
					<ModalHeader>Xác Nhận Xóa</ModalHeader>
					<ModalBody>
						{selectedTour && (
							<DeleteConfirmation
								tour={selectedTour}
								onConfirm={handleConfirmDelete}
								onCancel={onDeleteClose}
								isLoading={actionLoading}
							/>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	)
}

export default TourManagement
