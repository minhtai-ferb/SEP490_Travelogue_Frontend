'use client'

import BreadcrumbHeader from '@/components/common/breadcrumb-header'
import React, { useEffect, useState } from 'react'
import CraftVillageProfileView from './components/CraftVillageProfileView'
import { getUserFromLocalStorage } from '@/utils'
import { useUser } from '@/services/use-user'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

function page() {
	const [craftVillageId, setCraftVillageId] = useState<string | null>(null)
	const [loadingCraftVillageId, setLoadingCraftVillageId] = useState(true)
	const { getUserDetail } = useUser()
	const user = getUserFromLocalStorage()

	const items = [
		{ label: 'Dashboard', href: '/craftvillage/dashboard' },
		{ label: 'Hồ sơ làng nghề', href: '/craftvillage/dashboard/ho-so' },
	]

	// Function to get craft village ID from user detail
	const getCraftVillageId = async () => {
		try {
			setLoadingCraftVillageId(true)

			// Check localStorage first
			const storedCraftVillageId = localStorage.getItem("craftVillageId")
			if (storedCraftVillageId) {
				setCraftVillageId(storedCraftVillageId)
				return storedCraftVillageId
			}

			// If not in localStorage, get from user detail
			if (!user?.userId) {
				toast.error("Không tải được thông tin làng nghề !!!")
				return null
			}

			console.log("Fetching user detail for craftVillageId...")
			const userDetail = await getUserDetail(user.userId)
			console.log("User detail response:", userDetail)

			const craftVillageIdFromDetail = userDetail?.data?.craftVillagesInfo?.id || userDetail?.craftVillagesInfo?.id
			if (craftVillageIdFromDetail) {
				// Store for future use
				localStorage.setItem("craftVillageId", craftVillageIdFromDetail.toString())
				console.log("Got craftVillageId from user detail:", craftVillageIdFromDetail)
				setCraftVillageId(craftVillageIdFromDetail.toString())
				return craftVillageIdFromDetail.toString()
			}

			console.warn("No craftVillageId found in user detail")
			toast.error("Không tìm thấy thông tin làng nghề")
			return null
		} catch (error) {
			console.error("Error getting craftVillageId:", error)
			toast.error("Lỗi khi tải thông tin làng nghề")
			return null
		} finally {
			setLoadingCraftVillageId(false)
		}
	}

	useEffect(() => {
		getCraftVillageId()
	}, [])

	if (loadingCraftVillageId) {
		return (
			<div className="min-h-screen bg-gray-50">
				<BreadcrumbHeader items={items} />
				<div className="py-8">
					<div className="flex items-center justify-center min-h-[400px]">
						<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
					</div>
				</div>
			</div>
		)
	}

	if (!craftVillageId) {
		return (
			<div className="min-h-screen bg-gray-50">
				<BreadcrumbHeader items={items} />
				<div className="py-8">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="text-center">
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Không tìm thấy thông tin làng nghề
							</h2>
							<p className="text-gray-600">
								Vui lòng liên hệ quản trị viên để được hỗ trợ
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<BreadcrumbHeader items={items} />
			<div className="py-8">
				<CraftVillageProfileView craftVillageId={craftVillageId} />
			</div>
		</div>
	)
}

export default page