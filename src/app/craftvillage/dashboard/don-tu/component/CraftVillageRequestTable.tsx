"use client"

import React, { useState } from 'react'
import { Table, Tag, Image, Tooltip, Space, Badge, Typography, Card, Divider, Button, Select, Row, Col } from 'antd'
import {
	EyeOutlined,
	EditOutlined,
	ClockCircleOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	ShopOutlined,
	GlobalOutlined,
	PhoneOutlined,
	MailOutlined,
	EnvironmentOutlined,
	CalendarOutlined,
	DollarOutlined,
	TeamOutlined,
	StarOutlined,
	FilterOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useRouter } from 'next/navigation'

const { Text, Title } = Typography
const { Option } = Select

interface CraftVillageRequest {
	id: string
	ownerId: string
	ownerEmail: string
	ownerFullName: string
	name: string
	description: string
	content: string
	address: string
	latitude: number
	longitude: number
	openTime: string
	closeTime: string
	districtId: string
	phoneNumber: string
	email: string
	website: string | null
	workshopsAvailable: boolean
	signatureProduct: string
	yearsOfHistory: number
	isRecognizedByUnesco: boolean
	status: number
	statusText: string
	rejectionReason: string | null
	reviewedAt: string | null
	reviewedBy: string | null
	medias: Array<{
		mediaUrl: string
		isThumbnail: boolean
	}>
	workshop: {
		id: string
		name: string
		description: string
		content: string
		status: number
		ticketTypes: Array<{
			id: string
			type: number
			name: string
			price: number
			isCombo: boolean
			durationMinutes: number
			content: string
			workshopActivities: Array<{
				id: string
				activity: string
				description: string
				durationMinutes: number
				activityOrder: number
			}>
		}>
		recurringRules: Array<{
			id: string
			daysOfWeek: number[]
			sessions: Array<{
				id: string
				startTime: string
				endTime: string
				capacity: number
			}>
		}>
	}
}

interface CraftVillageRequestTableProps {
	data: CraftVillageRequest[]
	loading?: boolean
	onView?: (record: CraftVillageRequest) => void
	onEdit?: (record: CraftVillageRequest) => void
	onFilterChange?: (status: number | null) => void
	pagination?: {
		current: number
		pageSize: number
		total: number
		onChange: (page: number, pageSize: number) => void
	}
}

const CraftVillageRequestTable: React.FC<CraftVillageRequestTableProps> = ({
	data,
	loading = false,
	onView,
	onEdit,
	onFilterChange,
	pagination
}) => {
	const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
	const router = useRouter()
	const statusOptions = [
		{ value: 'all', label: 'Tất cả trạng thái', icon: null },
		{ value: 1, label: 'Đang chờ', icon: <ClockCircleOutlined />, color: 'processing' },
		{ value: 2, label: 'Đã xử lý', icon: <CheckCircleOutlined />, color: 'success' },
		{ value: 3, label: 'Đã hủy', icon: <CloseCircleOutlined />, color: 'error' },
	]

	const handleStatusChange = (value: number | string | null) => {
		const numericValue = value === 'all' ? null : (value as number)
		setSelectedStatus(numericValue)
		onFilterChange?.(numericValue)
	}
	const getStatusTag = (status: number, statusText: string) => {
		const statusConfig = {
			1: { color: 'processing', icon: <ClockCircleOutlined /> },
			2: { color: 'success', icon: <CheckCircleOutlined /> },
			3: { color: 'error', icon: <CloseCircleOutlined /> },
		}

		const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', icon: null }

		return (
			<Tag color={config.color} icon={config.icon}>
				{statusText}
			</Tag>
		)
	}

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(price)
	}

	const getDaysOfWeekText = (days: number[]) => {
		const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
		return days.map(day => dayNames[day]).join(', ')
	}

	const columns: ColumnsType<CraftVillageRequest> = [
		{
			title: 'Làng nghề',
			dataIndex: 'name',
			key: 'name',
			width: 280,
			sorter: (a, b) => a.name.localeCompare(b.name),
			render: (_, record) => (
				<Space direction="vertical" size="small" style={{ width: '100%' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						{record.medias?.[0] && (
							<Image
								src={record.medias[0].mediaUrl}
								alt={record.name}
								width={60}
								height={60}
								style={{ objectFit: 'cover', borderRadius: 8 }}
								preview={{ mask: <EyeOutlined /> }}
							/>
						)}
						<div style={{ flex: 1 }}>
							<Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
								{record.name}
							</Title>
							<Text type="secondary" style={{ fontSize: 12 }}>
								<EnvironmentOutlined /> {record.address.split(',').slice(-2).join(',')}
							</Text>
							<div style={{ marginTop: 4 }}>
								<Tag color="blue" style={{ fontSize: 11 }}>
									{record.signatureProduct}
								</Tag>
								{record.isRecognizedByUnesco && (
									<Tag color="gold" style={{ fontSize: 11 }}>
										UNESCO
									</Tag>
								)}
							</div>
						</div>
					</div>
				</Space>
			),
		},
		{
			title: 'Chủ sở hữu',
			dataIndex: 'ownerFullName',
			key: 'ownerFullName',
			width: 180,
			sorter: (a, b) => a.ownerFullName.localeCompare(b.ownerFullName),
			render: (_, record) => (
				<Space direction="vertical" size="small">
					<Text strong style={{ fontSize: 13 }}>
						{record.ownerFullName}
					</Text>
					<Text type="secondary" style={{ fontSize: 12 }}>
						<PhoneOutlined /> {record.phoneNumber}
					</Text>
				</Space>
			),
		},
		{
			title: 'Workshop',
			key: 'workshop_status',
			width: 120,
			align: 'center',
			sorter: (a, b) => Number(a.workshopsAvailable) - Number(b.workshopsAvailable),
			render: (_, record) => {
				if (!record.workshopsAvailable || !record.workshop) {
					return (
						<Tag color="default" icon={<CloseCircleOutlined />}>
							Không có
						</Tag>
					)
				}

				const ticketCount = record.workshop.ticketTypes?.length || 0
				return (
					<Space direction="vertical" size="small" style={{ textAlign: 'center' }}>
						<Tag color="success" icon={<CheckCircleOutlined />}>
							Có workshop
						</Tag>
						<Text style={{ fontSize: 11 }} type="secondary">
							{ticketCount} loại vé
						</Text>
					</Space>
				)
			},
		},
		{
			title: 'Hoạt động',
			key: 'operation_info',
			width: 140,
			sorter: (a, b) => a.yearsOfHistory - b.yearsOfHistory,
			render: (_, record) => (
				<Space direction="vertical" size="small">
					<Text style={{ fontSize: 12 }}>
						<ClockCircleOutlined /> {record.openTime} - {record.closeTime}
					</Text>
					<Text style={{ fontSize: 12 }}>
						<CalendarOutlined /> {record.yearsOfHistory} năm
					</Text>
				</Space>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			align: 'center',
			sorter: (a, b) => a.status - b.status,
			filters: [
				{ text: 'Đang chờ', value: 1 },
				{ text: 'Đã xử lý', value: 2 },
				{ text: 'Đã hủy', value: 3 },
			],
			onFilter: (value, record) => record.status === value,
			render: (_, record) => getStatusTag(record.status, record.statusText)
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<Tooltip title="Xem chi tiết">
						<Button
							type="text"
							size="small"
							icon={<EyeOutlined />}
							onClick={() => router.push(`don-tu/request/${record.id}`)}
						/>
					</Tooltip>
					{/* <Tooltip title="Chỉnh sửa">
						<Button
							type="text"
							size="small"
							icon={<EditOutlined />}
							onClick={() => onEdit?.(record)}
						/>
					</Tooltip> */}
				</Space>
			),
		},
	]

	return (
		<div style={{ background: '#fff' }}>
			{/* Filter Section */}
			<div style={{
				padding: '16px 24px',
				borderBottom: '1px solid #f0f0f0',
				background: '#fafafa'
			}}>
				<Row gutter={16} align="middle">
					<Col>
						<Space align="center">
							<FilterOutlined style={{ color: '#1890ff' }} />
							<Text strong>Bộ lọc:</Text>
						</Space>
					</Col>
					<Col>
						<Select
							style={{ width: 200 }}
							placeholder="Chọn trạng thái"
							allowClear
							value={selectedStatus}
							onChange={handleStatusChange}
						>
							{statusOptions.map((option) => (
								<Option key={option.value} value={option.value}>
									<Space>
										{option.icon}
										{option.label}
									</Space>
								</Option>
							))}
						</Select>
					</Col>
					{selectedStatus !== null && (
						<Col>
							<Text type="secondary" style={{ fontSize: 12 }}>
								Đang lọc: {statusOptions.find(opt => opt.value === selectedStatus)?.label}
							</Text>
						</Col>
					)}
				</Row>
			</div>

			<Table<CraftVillageRequest>
				columns={columns}
				dataSource={data}
				rowKey="id"
				loading={loading}
				pagination={pagination ? {
					current: pagination.current,
					pageSize: pagination.pageSize,
					total: pagination.total,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} của ${total} mục`,
					size: 'small',
					onChange: pagination.onChange,
					pageSizeOptions: ['5', '10', '20', '50'],
					position: ['bottomRight'],
				} : false}
				scroll={{ x: 900 }}
				size="middle"
				style={{
					background: '#fff',
				}}
			/>
		</div>
	)
}

export default CraftVillageRequestTable
