import React, { useState } from 'react'
import imagetradition from '../../../public/village.png'
import { motion } from 'framer-motion'
import { ShineBorder } from '../magicui/shine-border'
import { Experience } from '@/types/Experience'
import { useRouter } from 'next/navigation'

interface SectionNewsProps {
	item: Experience | null
}

function SectionNews({ item }: SectionNewsProps) {

	const [imageLoaded, setImageLoaded] = useState(false);
	const router = useRouter()

	const handleImageLoad = () => {
		setImageLoaded(true);
	};

	return (
		<ShineBorder
			className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
			color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
		>
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col-reverse md:flex-row items-center gap-8 bg-white rounded-xl shadow-lg overflow-hidden">
					{/* Content Section */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="w-full md:w-1/2 p-3 flex flex-col justify-center"
					>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="text-xl md:text-4xl font-bold text-gray-800 md:mb-4"
						>
							{item?.title}
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="text-gray-600 md:text-lg text-sm md:mb-6 mb-0"
						>
							{item?.description}
						</motion.p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-cyan-500 text-white text-xs font-semibold md:py-3 md:px-8 px-1 py-2 md:my-0 my-2 
							md:mx-0 mx-auto rounded-lg self-center md:self-start hover:bg-cyan-600 transition-colors duration-300"
							onClick={() => router.push(`/trai-nghiem/thong-tin/${item?.id}`)}
						>
							Xem thêm
						</motion.button>
					</motion.div>

					{/* Image Section */}
					<div className="w-full md:w-1/2 h-52 md:h-96 relative">
						{!imageLoaded && (
							<div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
						)}
						<motion.img
							initial={{ opacity: 0 }}
							animate={{ opacity: imageLoaded ? 1 : 0 }}
							transition={{ duration: 0.5 }}
							src={item?.medias?.[1]?.mediaUrl ?? '../../../public/placeholder_image.jpg'}
							alt="Innovation Technology"
							onLoad={handleImageLoad}
							className="w-full h-full object-cover rounded-xl"
							loading="lazy"
						/>
					</div>
				</div>
			</div>

		</ShineBorder>
	)
}

export default SectionNews