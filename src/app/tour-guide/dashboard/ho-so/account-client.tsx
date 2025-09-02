"use client"

import React, { useRef, useState, useEffect } from "react"
import {
	Form,
	Input,
	InputNumber,
	Select,
	Button,
	Avatar,
	Card,
	Row,
	Col,
	Typography,
	Space,
	Divider,
	message,
	Badge,
	Spin,
	Tooltip,
	Statistic
} from "antd"
import {
	UserOutlined,
	SaveOutlined,
	EditOutlined,
	PhoneOutlined,
	MailOutlined,
	EnvironmentOutlined,
	TeamOutlined,
	StarOutlined,
	ManOutlined,
	WomanOutlined,
	LoadingOutlined
} from '@ant-design/icons'
import { useTourguideAssign } from "@/services/tourguide"
import { useUser } from "@/services/use-user"
import { getUserFromLocalStorage } from "@/utils"
import AvatarUpload from "@/app/(client)/ho-so/components/avatar-upload/avatar-upload"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

interface TourGuideProfile {
	id: string
	email: string
	userName: string
	maxParticipants: number
	sex: number
	sexText: string
	address: string | null
	rating: number
	price: number
	introduction: string
	avatarUrl: string
	averageRating: number
	totalReviews: number
	reviews: any[]
}

interface UpdateProfileData {
	id?: string
	email: string
	phoneNumber: string
	fullName: string
	maxParticipants: number
	sex: number
	address: string
	introduction: string
}

export default function AccountClient() {
	const [form] = Form.useForm()
	const [profile, setProfile] = useState<TourGuideProfile | null>(null)
	const [loading, setLoading] = useState(true)
	const [updating, setUpdating] = useState(false)
	const [editMode, setEditMode] = useState(false)
	const [avatarUrl, setAvatarUrl] = useState<string>("")
	const [retryCount, setRetryCount] = useState(0)
	const [error, setError] = useState<string | null>(null)
	const avatarInputRef = useRef<HTMLInputElement>(null)

	const { getTourguideProfile, updateTourguide } = useTourguideAssign()
	const { getUserDetail } = useUser()
	const user = getUserFromLocalStorage()

	// Optimized function to get user detail and tourguide ID
	const getUserDetailAndTourguideId = async () => {
		try {
			if (!user?.userId) {
				console.warn("No user ID available in localStorage")
				return { userDetail: null, tourguideId: null }
			}

			console.log("Fetching user detail for userId:", user.userId)
			const userDetail = await getUserDetail(user.userId)
			console.log("User Detail Response:", userDetail)

			if (!userDetail?.tourGuideInfo?.id) {
				console.warn("No tourGuideInfo found in user detail:", userDetail)
				return { userDetail, tourguideId: null }
			}

			const tourguideId = userDetail.tourGuideInfo.id
			console.log("Found tourguideId:", tourguideId)

			// Cache tourguideId for future use
			localStorage.setItem("tourguideId", tourguideId.toString())

			return { userDetail, tourguideId }
		} catch (error) {
			console.error("Error fetching user detail:", error)
			return { userDetail: null, tourguideId: null }
		}
	}

	// Retry handler for failed operations
	const handleRetry = async () => {
		setRetryCount(prev => prev + 1)
		setError(null)
		message.info(`Đang thử lại lần ${retryCount + 1}...`)
		await loadProfile()
	}

	// Load profile data on component mount
	useEffect(() => {
		if (user?.userId) {
			loadProfile()
		} else {
			console.error("No user found in localStorage")
			message.error("Không tìm thấy thông tin người dùng trong localStorage")
			setLoading(false)
		}
	}, [user?.userId])

	const loadProfile = async () => {
		try {
			setLoading(true)
			setError(null)

			// Get tourguide ID using the optimized function
			const { userDetail, tourguideId } = await getUserDetailAndTourguideId()

			if (!tourguideId) {
				const errorMsg = "Không tìm thấy thông tin tourguide ID! Vui lòng kiểm tra lại tài khoản."
				setError(errorMsg)
				message.error(errorMsg)
				console.error("No valid tourguide ID found. UserDetail:", userDetail)
				return
			}

			console.log("Loading profile for tourguideId:", tourguideId)
			const profileData = await getTourguideProfile(tourguideId)
			console.log("Profile data loaded:", profileData)

			if (!profileData) {
				throw new Error("Không có dữ liệu hồ sơ")
			}

			setProfile(profileData)
			setAvatarUrl(profileData.avatarUrl)

			// Populate form with existing data
			form.setFieldsValue({
				email: profileData.email,
				phoneNumber: profileData.phoneNumber || "",
				fullName: profileData.userName,
				maxParticipants: profileData.maxParticipants,
				sex: profileData.sex,
				address: profileData.address || "",
				introduction: profileData.introduction || ""
			})
		} catch (error) {
			const errorMsg = `Không thể tải thông tin hồ sơ: ${error instanceof Error ? error.message : "Lỗi không xác định"}`
			console.error("Error loading profile:", error)
			setError(errorMsg)
			message.error(errorMsg)
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (values: UpdateProfileData) => {
		try {
			setUpdating(true)

			// Get tourguide ID using the optimized function
			const { tourguideId } = await getUserDetailAndTourguideId()
			if (!tourguideId) {
				message.error("Không tìm thấy thông tin tourguide ID để cập nhật!")
				return
			}

			// Include tourguide ID in the data
			const updateData = { ...values, id: tourguideId.toString() }
			console.log("Updating profile with data:", updateData)

			await updateTourguide(updateData)

			message.success("Cập nhật hồ sơ thành công!")
			setEditMode(false)

			// Reload profile data
			await loadProfile()
		} catch (error) {
			console.error("Error updating profile:", error)
			message.error(`Có lỗi xảy ra khi cập nhật hồ sơ: ${error instanceof Error ? error.message : "Lỗi không xác định"}`)
		} finally {
			setUpdating(false)
		}
	}

	// Error state
	if (error && !loading) {
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '60vh',
				gap: '16px',
				padding: '24px'
			}}>
				<div style={{
					textAlign: 'center',
					maxWidth: '500px',
					background: '#fff2f0',
					border: '1px solid #ffccc7',
					borderRadius: '8px',
					padding: '24px'
				}}>
					<Text type="danger" strong style={{ fontSize: '16px' }}>
						⚠️ Có lỗi xảy ra
					</Text>
					<div style={{ margin: '12px 0' }}>
						<Text type="secondary">{error}</Text>
					</div>
					{retryCount > 0 && (
						<div style={{ marginBottom: '16px' }}>
							<Text type="warning">Đã thử lại {retryCount} lần</Text>
						</div>
					)}
					<Button
						type="primary"
						onClick={handleRetry}
						loading={loading}
						icon={<LoadingOutlined />}
					>
						{loading ? "Đang thử lại..." : "Thử lại"}
					</Button>
				</div>
			</div>
		)
	}

	if (loading) {
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '60vh',
				gap: '16px'
			}}>
				<Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
				<div style={{ textAlign: 'center' }}>
					<Text type="secondary">Đang tải thông tin hồ sơ...</Text>
					{retryCount > 0 && (
						<div style={{ marginTop: 8 }}>
							<Text type="warning">Đã thử lại {retryCount} lần</Text>
						</div>
					)}
				</div>
			</div>
		)
	}

	if (!profile) {
		return (
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '60vh',
				flexDirection: 'column',
				gap: 16
			}}>
				<Text>Không thể tải thông tin hồ sơ</Text>
				<Button type="primary" onClick={loadProfile}>
					Thử lại
				</Button>
			</div>
		)
	}

	return (
		<div style={{
			background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
			minHeight: '100vh',
			padding: '24px'
		}}>
			<div style={{ maxWidth: 1200, margin: '0 auto' }}>
				{/* Header Card with Profile Banner */}
				<Card
					style={{
						marginBottom: 24,
						borderRadius: 16,
						overflow: 'hidden',
						boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
					}}
				>
					{/* Banner Background */}
					<div className=""
						style={{
							height: 200,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							position: 'relative',
							margin: '-24px -24px 0 -24px'
						}}>
						<div
							style={{
								position: 'absolute',
								bottom: -60,
								left: 40,
								display: 'flex',
								alignItems: 'end',
								gap: 24
							}}>
							{/* Avatar */}
							<div style={{ position: 'relative' }}>
								<Avatar
									size={120}
									src={avatarUrl}
									icon={<UserOutlined />}
									style={{
										border: '4px solid white',
										boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
									}}
								/>
							</div>

							{/* Profile Info */}
							<div style={{ color: 'blue', paddingBottom: 20 }}>
								<Title level={2} style={{ color: 'blue', margin: 0 }}>
									{profile?.userName}
								</Title>
								{/* <Space size="large" style={{ marginTop: 8 }}>
									<Badge count={profile?.totalReviews} showZero color="#52c41a">
										<Space>
											<StarOutlined />
											<Text style={{ color: 'white' }}>
												{profile?.averageRating}/5.0
											</Text>
										</Space>
									</Badge>
									<Space>
										<TeamOutlined />
										<Text style={{ color: 'white' }}>
											Tối đa {profile?.maxParticipants} người
										</Text>
									</Space>
								</Space> */}
							</div>
						</div>

						{/* Edit Mode Toggle */}
						<div style={{
							position: 'absolute',
							top: 20,
							right: 20
						}}>
							{!editMode ? (
								<Button
									type="primary"
									icon={<EditOutlined />}
									onClick={() => setEditMode(true)}
									style={{
										backgroundColor: 'rgba(255,255,255,0.2)',
										borderColor: 'rgba(255,255,255,0.3)',
										backdropFilter: 'blur(10px)'
									}}
								>
									Chỉnh sửa
								</Button>
							) : (
								<Space>
									<Button
										onClick={() => {
											setEditMode(false)
											form.resetFields()
										}}
									>
										Hủy
									</Button>
									<Button
										type="primary"
										icon={<SaveOutlined />}
										loading={updating}
										onClick={() => form.submit()}
									>
										Lưu thay đổi
									</Button>
								</Space>
							)}
						</div>
					</div>

					{/* Stats Row */}
					<div style={{ marginTop: 80, padding: '0 40px' }}>
						<Row gutter={24}>
							<Col span={8}>
								{/* <Statistic
									title="Đánh giá trung bình"
									value={profile?.averageRating}
									precision={1}
									suffix="/5.0"
									prefix={<StarOutlined style={{ color: '#faad14' }} />}
								/> */}
							</Col>
							<Col span={8}>
								{/* <Statistic
									title="Tổng đánh giá"
									value={profile?.totalReviews}
									suffix="đánh giá"
									prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
								/> */}
							</Col>
							<Col span={8}>
								{/* <Statistic
									title="Số người tối đa"
									value={profile?.maxParticipants}
									suffix="người/tour"
									prefix={<UserOutlined style={{ color: '#52c41a' }} />}
								/> */}
							</Col>
						</Row>
					</div>
				</Card>

				{/* Profile Form */}
				<Card
					title={
						<Space>
							<UserOutlined style={{ color: '#1890ff' }} />
							<span>Thông tin cá nhân</span>
						</Space>
					}
					style={{
						borderRadius: 16,
						boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
					}}
				>
					{/* Avatar Upload Section - Only show in edit mode */}
					{editMode && (
						<div style={{ marginBottom: 24 }}>
							<AvatarUpload />
							<Divider />
						</div>
					)}

					<Form
						form={form}
						layout="vertical"
						onFinish={handleSubmit}
						disabled={!editMode}
					>
						<Row gutter={24}>
							<Col md={12} xs={24}>
								<Form.Item
									name="fullName"
									label={
										<Space>
											<UserOutlined />
											<span>Họ và tên</span>
										</Space>
									}
									rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
								>
									<Input
										size="large"
										placeholder="Nhập họ và tên"
										style={{ borderRadius: 8 }}
									/>
								</Form.Item>
							</Col>
							<Col md={12} xs={24}>
								<Form.Item
									name="email"
									label={
										<Space>
											<MailOutlined />
											<span>Email</span>
										</Space>
									}
									rules={[
										{ required: true, message: 'Vui lòng nhập email!' },
										{ type: 'email', message: 'Email không hợp lệ!' }
									]}
								>
									<Input
										size="large"
										placeholder="example@email.com"
										style={{ borderRadius: 8 }}
									/>
								</Form.Item>
							</Col>
							<Col md={12} xs={24}>
								<Form.Item
									name="phoneNumber"
									label={
										<Space>
											<PhoneOutlined />
											<span>Số điện thoại</span>
										</Space>
									}
									rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
								>
									<Input
										size="large"
										placeholder="0901234567"
										style={{ borderRadius: 8 }}
									/>
								</Form.Item>
							</Col>
							<Col md={12} xs={24}>
								<Form.Item
									name="sex"
									label={
										<Space>
											<span>Giới tính</span>
										</Space>
									}
									rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
								>
									<Select
										size="large"
										placeholder="Chọn giới tính"
										style={{ borderRadius: 8 }}
									>
										<Option value={1}>
											<Space>
												<ManOutlined style={{ color: '#1890ff' }} />
												Nam
											</Space>
										</Option>
										<Option value={2}>
											<Space>
												<WomanOutlined style={{ color: '#eb2f96' }} />
												Nữ
											</Space>
										</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col md={12} xs={24}>
								<Form.Item
									name="maxParticipants"
									label={
										<Space>
											<TeamOutlined />
											<span>Số người tối đa</span>
										</Space>
									}
									rules={[{ required: true, message: 'Vui lòng nhập số người tối đa!' }]}
								>
									<InputNumber
										size="large"
										min={1}
										max={50}
										placeholder="15"
										style={{ width: '100%', borderRadius: 8 }}
										suffix="người"
									/>
								</Form.Item>
							</Col>
							<Col md={12} xs={24}>
								<Form.Item
									name="address"
									label={
										<Space>
											<EnvironmentOutlined />
											<span>Địa chỉ</span>
										</Space>
									}
									rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
								>
									<Input
										size="large"
										placeholder="123 Đường ABC, Quận XYZ, TP..."
										style={{ borderRadius: 8 }}
									/>
								</Form.Item>
							</Col>
							<Col xs={24}>
								<Form.Item
									name="introduction"
									label="Giới thiệu bản thân"
									rules={[{ required: true, message: 'Vui lòng nhập giới thiệu!' }]}
								>
									<TextArea
										rows={6}
										placeholder="Hãy chia sẻ về kinh nghiệm, sở thích và điều đặc biệt mà bạn mang lại cho khách hàng..."
										style={{ borderRadius: 8 }}
									/>
								</Form.Item>
							</Col>
						</Row>

						{editMode && (
							<div style={{ textAlign: 'center', marginTop: 24 }}>
								<Space size="large">
									<Button
										size="large"
										onClick={() => {
											setEditMode(false)
											form.resetFields()
										}}
										style={{ minWidth: 120 }}
									>
										Hủy
									</Button>
									<Button
										type="primary"
										size="large"
										htmlType="submit"
										loading={updating}
										icon={<SaveOutlined />}
										style={{ minWidth: 120, borderRadius: 8 }}
									>
										{updating ? 'Đang lưu...' : 'Lưu thay đổi'}
									</Button>
								</Space>
							</div>
						)}
					</Form>
				</Card>
			</div >
		</div >
	)
}
