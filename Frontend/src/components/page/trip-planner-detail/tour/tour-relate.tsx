import { SliderShowcase } from '@/components/common/slider/show-case'
import React from 'react'
import { motion } from 'framer-motion'

function TourRelate() {
	return (
		<div>
			{/* <p className='text-center text-2xl font-bold mb-6  text-from-blue-500 via-blue-600 to-purple-600 bg-clip-text'> */}
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-3"
			>
				Các chuyến đi tương tự
			</motion.h1>
			<SliderShowcase />
		</div>
	)
}

export default TourRelate
