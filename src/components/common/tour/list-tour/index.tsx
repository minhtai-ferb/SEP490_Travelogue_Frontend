'use client'
import { useTour } from '@/services/tour'
import { useEffect, useState } from 'react'
import ListCards from './list-card'

export function ListCurrentTours() {

	const [currentTours, setCurrentTours] = useState<any>()
	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)
	const { getAllTour } = useTour()


	useEffect(() => {
		fetchCurrentTours()
	}, [])

	const fetchCurrentTours = async () => {
		try {
			setLoading(true)
			const response = await getAllTour()
			setCurrentTours(response)
		} catch (err) {
			console.error('Error fetching current tours:', err);
			setError(true)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='relative py-6'>
			{/* Background image with overlay */}

			{/* List current tours */}
			<p className='relative text-center py-3 text-3xl md:text-5xl font-bold text-white leading-tight'>
				Các lịch trình gợi ý cho bạn
			</p>
			{loading && (
				<div className='flex justify-center items-center py-6'>
					<p className='text-gray-500'>Đang tải...</p>
				</div>
			)}
			{/* list cards */}
			{currentTours?.items?.length === 0 || error ? (
				<p className='text-center text-gray-500'>Không có lịch trình nào hiện tại</p>
			) : <ListCards list={currentTours} />
			}

		</div>
	)
}
