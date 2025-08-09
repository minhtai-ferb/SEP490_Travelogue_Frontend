'use client'

import { TextAnimate } from '@/components/magicui/text-reveal'
import { motion } from "motion/react"; // Note: Verify this import (see below)
import Image from 'next/image'
import doubleQuote from '../../../../../../public/icon/double.png'

function ExploreEvent() {

	const images = [
		{ no: 1, src: '/image/event_1.png', alt: 'Amusement park swing ride' },
		{ no: 2, src: '/image/event2.png', alt: 'Cultural statue and temple' },
		{ no: 3, src: '/image/event3.png', alt: 'Nighttime dragon boat festival' },
		{ no: 4, src: '/image/event4.png', alt: 'Illuminated temple at night' },
		{ no: 5, src: '/image/event_2.png', alt: 'People in traditional attire at temple' },
		{ no: 6, src: '/image/event6.png', alt: 'Swing ride from another angle' },
	]

	return (
		<div className=''>
			<section className='relative flex gap-3 justify-center'>
				<div className='flex flex-col gap-3'>
					<span className='flex flex-col justify-center mx-auto'>
						<div className='flex gap-10'>
							<TextAnimate
								animation="slideUp"
								by="word"
								className='text-4xl font-medium text-[#007AFF] font-sans'
							>
								Hãy cùng chúng tôi
							</TextAnimate>
							<motion.img
								initial={{ y: -30, opacity: 0, rotate: 180 }}
								animate={{ y: 0, opacity: 1, rotate: 0 }}
								transition={{
									duration: 0.6,
									delay: 0.5,
									ease: "easeOut"
								}}
								className='self-end' src={doubleQuote.src} alt='double-quote' height={50} width={50} />
						</div>
						<div className='flex gap-6'>
							<motion.img
								initial={{ y: -30, opacity: 0 }}
								animate={{ y: 0, opacity: 1, rotate: 180 }}
								transition={{
									duration: 0.6,
									delay: 0.5,
									ease: "easeOut",
								}}
								className='self-start rotate-180' src={doubleQuote.src} alt='double-quote' height={50} width={50} />
							<TextAnimate
								animation="slideUp"
								by="word"
								className='text-4xl font-medium text-[#007AFF] font-sans'
							>
								Khám phá & tận hưởng!
							</TextAnimate>
						</div>
					</span>
					<motion.p
						className='text-2xl font-medium font-sans'
						initial={{ x: -100, opacity: 0 }}
						whileInView={{ x: 0, opacity: 1 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{
							type: "tween",
							stiffness: 50,
							damping: 20,
							duration: 0.8
						}}
					>
						Tìm hiểu về những ngày lễ và dịp đặc biệt được yêu thích nhất ở Việt Nam.
					</motion.p>

				</div>
			</section>
			<div className="flex flex-col md:flex-row gap-4 mt-8">
				<div className="w-full md:w-1/2">
					<Image
						src="/image/event_1.png"
						alt="Cultural statue under blue sky"
						width={400}
						height={400}
						className="object-cover w-full h-full"
					/>
				</div>

				<div className="w-full md:w-1/2 grid grid-cols-3 grid-rows-2 gap-3">
					{images.map((image) => (
						<div key={image.no} className="relative">
							<Image
								src={image.src}
								alt={image.alt}
								width={400}
								height={400}
								className="object-cover w-full h-full border border-blue-300 transition-transform duration-200 hover:scale-105"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ExploreEvent
