'use client'
import { useEffect, useState } from 'react'
import TourCard from './list-card/tour'
import ListCards from './list-card'

export function ListCurrentTours() {

	const [currentTours, setCurrentTours] = useState<any[]>([])

	useEffect(() => {
		fetchCurrentTours()
	}, [])

	const fetchCurrentTours = async () => {
		try {
			const currentToursFetch = [
				{
					id: 1,
					name: 'Tour 1',
					description: 'This is tour 1',
					image: '/image/auth_form.JPG',
					price: 100,
					destination: 'Dương Minh Châu',
					type: 'Thư giản'
				},
				{
					id: 2,
					name: 'Tour 2',
					description: 'This is tour 2',
					image: '/image/auth_form.JPG',
					price: 100,
					destination: 'Dương Minh Châu',
					type: 'Thư giản'
				},
				{
					id: 3,
					name: 'Tour 3',
					description: 'This is tour 3',
					image: '/image/auth_form.JPG',
					price: 100,
					destination: 'Dương Minh Châu',
					type: 'Thư giản'
				},
				{
					id: 4,
					name: 'Tour 4',
					description: 'This is tour 4',
					image: '/image/auth_form.JPG',
					price: 100,
					destination: 'Dương Minh Châu',
					type: 'Thư giản'
				},
				{
					id: 5,
					name: 'Tour 5',
					description: 'This is tour 5',
					image: '/image/auth_form.JPG',
					price: 100,
					destination: 'Dương Minh Châu',
					type: 'Thư giản'
				},
				{
					id: 6,
					name: 'Tour 6',
					description: 'This is tour 6',
					image: '/image/auth_form.JPG',
					price: 100,
					destination: 'Dương Minh Châu',
					type: 'Thư giản'
				},
				{
					id: 7,
					name: 'Tour 7',
					description: 'This is tour 7',
					image: '/image/auth_form.JPG',
					price: 100,
					destination: 'Dương Minh Châu',
					type: 'Thư giản'
				},
			]
			setCurrentTours(currentToursFetch)
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
			<p className='relative text-5xl font-medium text-pretty w-screen text-center font-fleur text-slate-100'>
				Các lịch trình gợi ý cho bạn
			</p>

			{/* list cards */}
			<ListCards list={currentTours} />

		</div>
	)
}
