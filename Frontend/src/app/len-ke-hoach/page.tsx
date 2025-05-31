'use client'

import TripPlannerPage from '@/components/page/trip-planner'
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'
import { useRouter } from 'next/navigation'
import React from 'react'

function page() {
	const router = useRouter()
	const handleBack = () => {
		router.back()
	}

	return (
		<div>
			<Breadcrumbs className='px-6 py-3' size='lg'>
				<BreadcrumbItem onClick={() => { handleBack() }}>Trở về</BreadcrumbItem>
				<BreadcrumbItem>Lập kế hoạch chuyến đi</BreadcrumbItem>
			</Breadcrumbs>
			<TripPlannerPage />
		</div>
	)
}

export default page