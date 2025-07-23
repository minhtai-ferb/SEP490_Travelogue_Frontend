'use client'

import React from 'react'
import TourCard from './tour'
import { Marquee } from '@/components/magicui/marquee'

interface ListCardsProps {
	list: any[]
}

function ListCards({ list }: ListCardsProps) {
	return (
		<Marquee pauseOnHover className='py-6'>
			<div className='relative flex w-full h-full gap-12 mt-6 px-3'>
				{list?.map((tour) => (
					<TourCard key={tour.id} tour={tour} />
				))
				}
			</div>
		</Marquee>
	)
}

export default ListCards