"use client"

import React, { useState, useEffect } from 'react'
import { Card, Button, Space, message, Modal } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useCraftVillage } from '@/services/use-craftvillage'
import CraftVillageRequestTable from './component/CraftVillageRequestTable'
import { set } from 'date-fns'

function page() {
	const [pageNumber, setPageNumber] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [total, setTotal] = useState(0)
	const [status, setStatus] = useState<number | null>(null)
	const { getCraftVillageRequest, transformUserToCraftVillageRole, loading } = useCraftVillage()
	const [data, setData] = useState<any[]>([])

	const fetchFormRequest = async () => {
		const payload: any = {
			pageNumber: pageNumber,
			pageSize: pageSize
		}

		// Chỉ thêm status vào payload nếu nó không phải null
		if (status !== null) {
			payload.status = status
		}

		try {
			const response = await transformUserToCraftVillageRole(payload)
			if (response?.items && response.items.length > 0) {
				setData(response.items)
				setTotal(response.totalCount || response.items.length)
				return response
			} else {
				setData([])
				setTotal(0)
				return null
			}
		} catch (error) {
			console.error("Error fetching form request:", error)
			setData([])
			setTotal(0)
			return null
		}
	}

	useEffect(() => {
		// Load data immediately when component mounts
		loadInitialData()
	}, [])

	const loadInitialData = async () => {
		try {
			const response = await fetchFormRequest()
		} catch (error) {
			console.error("Error loading initial data:", error)
			// Load sample data as fallback
		}
	}


	const handleView = (record: any) => {
		Modal.info({
			title: `Chi tiết: ${record.name}`,
			content: (
				<div>
					<p><strong>Chủ sở hữu:</strong> {record.ownerFullName}</p>
					<p><strong>Email:</strong> {record.ownerEmail}</p>
					<p><strong>Địa chỉ:</strong> {record.address}</p>
					<p><strong>Sản phẩm đặc trưng:</strong> {record.signatureProduct}</p>
					<p><strong>Số năm hoạt động:</strong> {record.yearsOfHistory} năm</p>
					<p><strong>UNESCO:</strong> {record.isRecognizedByUnesco ? 'Có' : 'Không'}</p>
					<p><strong>Workshop:</strong> {record.workshopsAvailable ? 'Có' : 'Không'}</p>
				</div>
			),
			width: 600,
		})
	}

	const handleEdit = (record: any) => {
		Modal.confirm({
			title: `Chỉnh sửa: ${record.name}`,
			content: 'Chức năng chỉnh sửa sẽ được triển khai sau.',
			onOk() {
				message.info('Chức năng đang phát triển!')
			},
		})
	}

	const handleAdd = () => {
		message.info('Chức năng thêm mới đang phát triển!')
	}

	const handleFilterChange = (newStatus: number | null) => {
		setStatus(newStatus)
		setPageNumber(1) // Reset to first page when filtering
		// Reload data with new filter
		fetchFormRequestWithStatus(newStatus)
	}

	const handlePaginationChange = (page: number, size: number) => {
		setPageNumber(page)
		setPageSize(size)
		// Fetch data with new pagination
		fetchFormRequestWithPagination(page, size)
	}

	const fetchFormRequestWithPagination = async (page: number, size: number) => {
		const payload: any = {
			pageNumber: page,
			pageSize: size
		}

		// Chỉ thêm status vào payload nếu nó không phải null
		if (status !== null) {
			payload.status = status
		}

		try {
			const response = await transformUserToCraftVillageRole(payload)
			if (response?.items) {
				setData(response.items)
				setTotal(response.totalCount || response.items.length)
			}
		} catch (error) {
			console.error("Error fetching form request:", error)
		}
	}

	const fetchFormRequestWithStatus = async (filterStatus: number | null = status) => {
		const payload: any = {
			pageNumber: pageNumber,
			pageSize: pageSize
		}

		// Chỉ thêm status vào payload nếu nó không phải null
		if (filterStatus !== null) {
			payload.status = filterStatus
		}

		try {
			const response = await transformUserToCraftVillageRole(payload)
			setData(response?.items)
		} catch (error) {
			console.error("Error fetching form request:", error)
		}
	}

	return (
		<div style={{
			padding: '24px',
			background: '#f5f5f5',
			minHeight: '100vh'
		}}>
			<Card
				title="Đơn đăng ký của bạn"
				// extra={
				// 	<Space>
				// 		<Button
				// 			type="primary"
				// 			icon={<PlusOutlined />}
				// 			onClick={handleAdd}
				// 		>
				// 			Thêm mới
				// 		</Button>
				// 		<Button
				// 			icon={<ReloadOutlined />}
				// 			onClick={() => fetchFormRequestWithStatus()}
				// 			loading={loading}
				// 		>
				// 			Tải lại
				// 		</Button>
				// 	</Space>
				// }
				style={{ background: '#fff' }}
				styles={{ body: { padding: 0 } }}
			>
				<CraftVillageRequestTable
					data={data}
					loading={loading}
					onView={handleView}
					onEdit={handleEdit}
					onFilterChange={handleFilterChange}
					pagination={{
						current: pageNumber,
						pageSize: pageSize,
						total: total,
						onChange: handlePaginationChange,
					}}
				/>
			</Card>
		</div>
	)
}

export default page