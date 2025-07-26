'use client'

import Image from 'next/image'
import Link from 'next/link'

interface TourCardProps {
	tour: any
}

function TourCard({ tour }: TourCardProps) {

	return (
		<Link href={`/chuyen-di/${tour?.tourId}`}>
			<section key={tour?.tourId} className='flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300'>
				{/* image - header */}
				<div className='h-fit'>
					<Image src={"/image/auth_form.JPG"} alt="information-image" width={360} height={300} className='' />				</div>
				{/* footer */}
				<footer className='relative h-fit text-center bg-white w-full font-poppin'>
					{tour?.name}
				</footer>
			</section>
		</Link>
	)
}

export default TourCard