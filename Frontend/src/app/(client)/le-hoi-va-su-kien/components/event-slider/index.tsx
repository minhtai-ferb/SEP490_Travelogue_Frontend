'use client'

import SectionNews from "@/components/handicraftdDisplay";
import { useExperience } from "@/services/experience";
import { Experience } from "@/types/Experience";
import { useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SliderEvent = () => {

	const [experiences, setexperiences] = useState<Experience[]>([])
	const { getExperienceSearch } = useExperience()

	const fetchExperiences = async () => {
		try {
			const response = await getExperienceSearch(
				{
					pageNumber: 1,
					pageSize: 1000,
				}
			)

			setexperiences(response)
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		fetchExperiences()
	}, [])

	return (
		<div className="w-full max-w-5xl mx-auto">
			<Swiper
				direction="vertical"
				pagination={{
					clickable: true,
					bulletClass: "swiper-pagination-bullet custom-bullet",
					bulletActiveClass: "swiper-pagination-bullet-active custom-bullet-active",
				}}
				modules={[Pagination, Autoplay]}
				className="product-swiper w-full h-[50vh] min-h-[300px] max-h-[600px]"
				autoplay={{
					delay: 8000,
					disableOnInteraction: false,
				}}
				slidesPerView={1}
				spaceBetween={10}
				breakpoints={{
					0: {
						slidesPerView: 1,
						spaceBetween: 5,
					},
					640: {
						slidesPerView: 1,
						spaceBetween: 10,
					},
					768: {
						slidesPerView: 1,
						spaceBetween: 20,
					},
					1024: {
						slidesPerView: 1,
						spaceBetween: 30,
					},
				}}
			>
				{experiences?.slice(0, 5).map((item) => (
					<SwiperSlide>
						<div className="w-full h-full flex items-center justify-center">
							<SectionNews key={item?.id} item={item} />
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default SliderEvent;