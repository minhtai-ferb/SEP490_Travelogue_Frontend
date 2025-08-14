'use client'

import Frame from '@/components/frame';
import SelectSection from '@/components/selectsection';
import { CiCloudSun } from "react-icons/ci";
import { GiGreenhouse } from "react-icons/gi";
import { IoRestaurantOutline } from "react-icons/io5";
import { LuBookMarked } from "react-icons/lu";
import { MdOutlineShoppingBag } from "react-icons/md";
import { PiAirplaneInFlight } from "react-icons/pi";

import { Experience as ExperienceType } from '@/types/News';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import backgroundhandmade from '../../../../public/bghandmade.png';
import { useNews } from '@/services/use-news';
import { getTypeExperienceLabel, TypeExperience } from '@/types/News';
import { AiOutlineHome } from 'react-icons/ai';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

const Experience = () => {
	const { getPagedExperiences } = useNews();
	const [filteredExperience, setFilteredExperience] = useState<ExperienceType[]>([]);


	const handleFilter = async (typeExperience?: string) => {
		try {
			const response = await getPagedExperiences({
				typeExperience: typeExperience === "0" ? undefined : Number(typeExperience),
				pageNumber: 1,
				pageSize: 1000,
			});
			setFilteredExperience(response.data);
		} catch (error) {
			console.log("Filter error:", error);
		}
	};

	useEffect(() => {
		handleFilter();
	}, []);

	//  Adventure = "Phiêu lưu",
	// Cultural = "Văn hóa",
	// Culinary = "Ẩm thực",
	// Ecotourism = "Du lịch sinh thái",
	// Leisure = "Giải trí",
	// Spiritual = "Tâm linh",
	// Extreme = "Mạo hiểm",

	const sectionstyle = [
		{ icon: <AiOutlineHome />, title: 'Tất cả', color: 'red' },
		{ icon: <PiAirplaneInFlight />, title: 'Phiêu lưu', color: 'blue' },
		{ icon: <LuBookMarked />, title: 'Văn hóa', color: 'blue' },
		{ icon: <IoRestaurantOutline />, title: 'Ẩm thực', color: 'green' },
		{ icon: <MdOutlineShoppingBag />, title: 'Du lịch sinh thái', color: 'yellow' },
		{ icon: <GiGreenhouse />, title: 'Giải trí', color: 'purple' },
		{ icon: <CiCloudSun />, title: 'Tâm linh', color: 'orange' },
		{ icon: <MdOutlineShoppingBag />, title: 'Mạo hiểm', color: 'red' },
	];

	return (
		<div className='flex flex-col gap-4 my-3 h-full md:mb-10' style={{ backgroundImage: `url(${backgroundhandmade.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
			<h1 className='md:text-5xl text-3xl font-bold text-center text-blue-500 my-6'>Tái hiện từng trải nghiệm</h1>
			<section className='lg:flex hidden gap-4 lg:gap-6 justify-around lg:w-5/6 mx-auto w-full flex-wrap px-4 md:px-0'>
				<Swiper slidesPerView={6} spaceBetween={10} className='w-full' modules={[Navigation]} navigation>
					{Object.values(TypeExperience).map((type) => {
						const styleItem = sectionstyle.find((item) => item.title === getTypeExperienceLabel(type as TypeExperience));
						if (styleItem) {
							return (
								<SwiperSlide key={type.toString()}>
									<SelectSection
										icon={styleItem.icon}
										title={getTypeExperienceLabel(type as TypeExperience)}
										color={styleItem.color}
										onClick={() => handleFilter(type.toString())}
									/>
								</SwiperSlide>
							);
						}
						return null;
					})}
				</Swiper>
			</section>

			<section className='flex justify-center items-center'>
				<div className='md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 flex md:flex-wrap
				flex-col justify-center h-full w-full md:w-5/6 lg:w-4/5 xl:w-3/4 p-2'>
					{filteredExperience?.slice(0, 8).map((item: ExperienceType, index) => (
						<Link href={`/trai-nghiem/thong-tin/${item.id}`} key={index}>
							<Frame
								image={Array.isArray(item?.medias) && item.medias.length > 0 ? item.medias[0].mediaUrl : '/image/default_image.png	'}
								title={item?.title}
							/>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
};

export default Experience;