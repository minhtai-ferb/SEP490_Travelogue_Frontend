'use client'

import CardPlace from '@/components/common/card-place'
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'
import { useRouter } from 'next/navigation'
import React from 'react'

function Page() {
	const router = useRouter()

	const handleBack = () => {
		router.back()
	}

	return (
		<div className=''>
			{/* Breadscrumb */}
			<Breadcrumbs className='px-6 py-3' size='lg'>
				<BreadcrumbItem onClick={() => { handleBack() }}>Trở về</BreadcrumbItem>
				<BreadcrumbItem>Chi tiết chuyến đi</BreadcrumbItem>
			</Breadcrumbs>
			<div className="flex h-screen overflow-hidden my-12">
				<div
					className="w-2/5 h-screen sticky top-10 bg-cover bg-center rounded-tr-3xl rounded-br-3xl"
					style={{ backgroundImage: "url('/image/auth_form.JPG')" }}
				/>

				<div className="custom-scrollbar w-full h-screen overflow-y-auto p-6 space-y-8">
					<h1 className="text-3xl font-bold mb-4">Chi tiết chuyến đi</h1>

					{Array.from({ length: 10 }).map((_, i) => (
						<CardPlace i={i} key={i} />
					))}
				</div>
			</div>
		</div>
	)
}

export default Page
