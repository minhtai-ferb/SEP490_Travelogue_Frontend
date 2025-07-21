'use client'
import { useTripPlan } from '@/services/trip-plan'
import { useEffect, useState } from 'react'
import ListCards from './list-card'

export function ListCurrentTours() {

	const [currentTours, setCurrentTours] = useState<any>()
	const { geTripPlanSearch } = useTripPlan()

	useEffect(() => {
		fetchCurrentTours()
	}, [])

	const fetchCurrentTours = async () => {
		try {
			const response = await geTripPlanSearch({
				title: '',
				pageNumber: 1,
				pageSize: 10,
			})
			console.log('Fetched current tours:', response)
			setCurrentTours(response)
		} catch (err) {
			console.error('Error fetching current tours:', err);
		} finally {
			// Any cleanup actions can be added here
		}
	}

	return (
		<div className='relative py-6'>
			{/* Background image with overlay */}

			{/* List current tours */}
			<p className='relative text-center py-3 text-3xl md:text-5xl font-bold text-white leading-tight'>
				Các lịch trình gợi ý cho bạn
			</p>

			{/* list cards */}
			{currentTours?.items?.length === 0 ? (
				<p className='text-center text-gray-500'>Không có lịch trình nào hiện tại</p>
			) : <ListCards list={currentTours} />
			}


		</div>
	)
}
