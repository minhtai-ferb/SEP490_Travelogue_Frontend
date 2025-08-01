'use client'

import Counterparty from '@/components/common/counter';
import Experience from '@/components/common/experience';
import MapTayNinh from '@/components/common/map-tay-ninh-hp';
import { SectionIntroduce } from '@/components/common/section-introduce';
import StorySharing from '@/components/common/story-sharing';
import Header from '@/components/header';
import { BentoShowcase } from '@/components/ui/photo-gallery-showcase/bento/showcase';
import 'swiper/css';
import 'swiper/css/pagination';
import { HandmadeProductTayNinh } from './le-hoi-va-su-kien/components/product-TayNinh';
import LocationIntroduce from './le-hoi-va-su-kien/components/slider-introduce-locations';

export default function HomePage() {
	return (
		<div className="flex flex-col min-h-screen w-full">
			{/* Header section - full width */}
			<div className="w-full">
				<Header />
			</div>

			{/* Main content with responsive container */}
			<main className="flex-1">
				{/* Introduction section with responsive padding */}
				<section className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12">
					<SectionIntroduce />
				</section>

				{/* Handmade products section */}
				<section className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 bg-gray-50">
					<div className="max-w-7xl mx-auto">
						<HandmadeProductTayNinh />
					</div>
				</section>

				{/* Events slider section
				<section className="w-full sm:px-6 md:px-8 py-8 md:py-12">
					<LocationIntroduce />
				</section> */}

				{/* showcase tour section */}
				<section className="w-full px-4 sm:px-6 md:px-8 md:py-12 bg-gray-50">
					<div className="max-w-7xl mx-auto">
						<h1 className="text-3xl md:text-6xl font-bold text-blue-500 text-center">Nhiều địa điểm du lịch được ưa thích</h1>
						<BentoShowcase />
					</div>
				</section>

				{/* Experience section */}
				<section className="w-full h-full">
					<div className="max-w-7xl mx-auto h-full">
						<Experience />
					</div>
				</section>

				{/* Map section */}
				<section className="w-full">
					<div className="">
						<MapTayNinh />
					</div>
				</section>

				{/* Story sharing section */}
				<section className="w-full">
					<div className="max-w-7xl mx-auto">
						<StorySharing />
					</div>
				</section>

				{/* Counterparty section */}
				<section className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12">
					<div className="max-w-7xl mx-auto">
						<Counterparty />
					</div>
				</section>
			</main>
		</div>
	)
}