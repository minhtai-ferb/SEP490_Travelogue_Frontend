import Frame from '@/components/frame';
import SelectSection from '@/components/selectsection';
import { CiCloudSun } from "react-icons/ci";
import { GiGreenhouse } from "react-icons/gi";
import { IoRestaurantOutline } from "react-icons/io5";
import { LuBookMarked } from "react-icons/lu";
import { MdOutlineShoppingBag } from "react-icons/md";
import { PiAirplaneInFlight } from "react-icons/pi";
import { useExperienceController } from '@/services/experience-controller';
import { Experience, ExperienceTypes } from '@/types/Experience';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import backgroundhandmade from '../../../../public/bghandmade.png';
import { Spin } from 'antd';

const ExperienceTNPage = () => {
	const { getAllTypeExperience, searchExperience } = useExperienceController();
	const [types, setTypes] = useState<ExperienceTypes[]>([]);
	const [filteredExperience, setFilteredExperience] = useState<Experience[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchAlltypeExperience = async () => {
		try {
			const response = await getAllTypeExperience();
			console.log("types", response);
			setTypes(response);
		} catch (error) {
			console.log(error);
		}
	};

	const handleFilter = async (typeId?: string) => {
		try {
			const response = await searchExperience({
				typeExperienceId: typeId,
				pageNumber: 1,
				pageSize: 1000,
			});
			console.log("filtered response", response);
			setFilteredExperience(Array.isArray(response.data) ? response.data : []);
		} catch (error) {
			console.log("Filter error:", error);
			setFilteredExperience([]);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			await handleFilter();
			await fetchAlltypeExperience();
			setIsLoading(false);
		};
		fetchData();
	}, []);

	const sectionstyle = [
		{ icon: <PiAirplaneInFlight />, title: 'Tất cả', color: 'red' },
		{ icon: <LuBookMarked />, title: 'Văn hóa & lịch sử', color: 'blue' },
		{ icon: <IoRestaurantOutline />, title: 'Ẩm thực', color: 'green' },
		{ icon: <MdOutlineShoppingBag />, title: 'Mua sắm', color: 'yellow' },
		{ icon: <GiGreenhouse />, title: 'Giải trí', color: 'purple' },
		{ icon: <CiCloudSun />, title: 'Thiên nhiên', color: 'orange' },
	];

	if (isLoading) {
		return <Spin size="large" />
	}

	return (
		<div className='flex flex-col gap-4 my-3 h-full md:mb-10' style={{ backgroundImage: `url(${backgroundhandmade.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
			<section className='lg:flex hidden gap-4 lg:gap-6 justify-around lg:w-5/6 mx-auto w-full flex-wrap px-4 md:px-0'>
				<SelectSection
					icon={sectionstyle[0].icon}
					title={sectionstyle[0].title}
					color={sectionstyle[0].color}
					onClick={() => handleFilter()}
				/>
				{types?.map((type) => {
					const styleItem = sectionstyle.find((item) => item.title === type.typeName);
					if (styleItem) {
						return (
							<SelectSection
								key={type.id}
								icon={styleItem.icon}
								title={type.typeName}
								color={styleItem.color}
								onClick={() => handleFilter(type.id)}
							/>
						);
					}
					return null;
				})}
			</section>

			<h1 className='md:text-5xl text-3xl font-bold text-center text-blue-500 my-6'>Trải nghiệm nổi bật</h1>
			<section className='flex justify-center items-center'>
				<div className='md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 flex flex-wrap justify-center items-center h-full w-5/6'>
					{filteredExperience?.map((items, index) =>
						items ? (
							<Link href={`/trai-nghiem/thong-tin/${items.id}`} key={index} className='w-full h-full'>
								<Frame
									image={items?.medias?.[0]?.mediaUrl || ''}
									title={items.title}
									key={index}
								/>
							</Link>
						) : null
					)}
				</div>
			</section>
		</div>
	);
};

export default ExperienceTNPage;