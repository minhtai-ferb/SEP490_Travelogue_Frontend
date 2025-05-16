
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import property1 from '../../../../public/Property1.png';
import property2 from '../../../../public/Property2.png';
import property3 from '../../../../public/Property3.png';
import property4 from '../../../../public/Property4.png';
import property5 from '../../../../public/Property5.png';
import property6 from '../../../../public/Property6.png';
import team from '../../../../public/devteam.png';
import { Marquee } from '@/components/magicui/marquee';


const Counterparty = () => {
	const images = [
		{ src: property1, alt: 'hinh', width: 150, height: 150 },
		{ src: property2, alt: 'hinh', width: 200, height: 200 },
		{ src: property3, alt: 'hinh', width: 200, height: 200 },
		{ src: property4, alt: 'hinh', width: 200, height: 200 },
		{ src: property5, alt: 'hinh', width: 200, height: 200 },
		{ src: property6, alt: 'hinh', width: 200, height: 200 },
		// { src: team, alt: 'hinh', width: 200, height: 200 },
	];

	return (
		<section className="flex flex-col py-10 md:mt-10">
			<h1 className="md:text-5xl text-3xl font-bold text-blue-500 text-center">Đối tác</h1>

			{/* Image container
			<section className="md:flex flex-wrap hidden justify-center items-center md:gap-6 md:my-4 my-6">
				{images.map((image, index) => (
					<Image
						key={index}
						src={image.src}
						alt={image.alt}
						width={image.width}
						height={image.height}
						className="object-contain grayscale hover:grayscale-0"
					/>
				))}
			</section> */}
			<Marquee reverse pauseOnHover className="md:flex gap-10 hidden [--duration:20s]">
				{images.map((image, index) => (
					<Image
						key={index}
						src={image.src}
						alt={image.alt}
						width={image.width}
						height={image.height}
						className="object-contain grayscale hover:grayscale-0"
					/>
				))}
			</Marquee>

			<Marquee reverse pauseOnHover className="flex md:hidden [--duration:20s]">
				{images.map((image, index) => (
					<Image
						key={index}
						src={image.src}
						alt={image.alt}
						width={image.width}
						height={image.height}
						className="object-contain w-[140px] h-[100px]"
					/>
				))}
			</Marquee>

		</section>
	)
}

export default Counterparty;