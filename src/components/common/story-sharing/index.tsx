
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import sharing from '../../../../public/Framesharing.png';
import sharing1 from '../../../../public/Framesharing1.png';
import sharing2 from '../../../../public/Framesharing2.png';
import sharing3 from '../../../../public/Framesharing3.png';
import sharing4 from '../../../../public/Framesharing4.png';
import { useEffect, useState } from 'react';
import { useNews } from '@/services/use-news';
import { News } from '@/types/News';
import { ListMedia } from '@/types/News';
const StorySharing = () => {

	const [experiences, setexperiences] = useState<News[]>([])
	const { getPagedExperiences } = useNews()

	const fetchExperiences = async () => {
		try {
			const response = await getPagedExperiences(
				{
					pageNumber: 1,
					pageSize: 5,
				}
			)

			console.log("experiences", response);
			setexperiences(response.data)
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		fetchExperiences()
	}, [])

	return (
		<section className='bg-gray-100 md:h-screen h-full flex flex-col md:gap-8 md:py-10 gap-3 py-5'>
			<h1 className="font-bold text-blue-500 text-center md:text-5xl text-3xl md:mt-0 mt-6">Chia sẻ câu chuyện của bạn</h1>
			<p className="text-center text-gray-500 md:text-2xl text-base">
				Hãy gắn thẻ những khoảnh khắc tuyệt vời nhất của bạn với{" "}
				<span className="text-blue-500 font-bold md:text-xl text-base">#huongsactayninh</span> trên các nền tảng xã hội!
			</p>

			<div className="md:flex gap-4 px-4 md:px-10 w-full md:w-5/6 mx-auto flex-1">
				{/* First Half: Image Grid */}
				<div className="w-full md:w-1/2 md:flex flex-wrap gap-4">
					{experiences?.slice(0, 4).map((item, index) => (
						<div key={item?.id} className="w-full md:w-[calc(50%-0.5rem)] aspect-square md:mt-0 mt-3">
							<Image
								src={item?.medias?.[0]?.mediaUrl ?? sharing}
								alt={`hinh-${index}`}
								width={400}
								height={400}
								className="w-full h-full object-cover rounded-lg"
							/>
						</div>
					))}
				</div>

				{/* Second Half: Single Large Image */}
				<div className="w-full md:w-1/2 mt-4 md:mt-0">
					<Image
						src={experiences[4]?.medias?.[0]?.mediaUrl ?? sharing1}
						alt="hinh-large"
						width={400}
						height={400}
						className="w-full h-full object-cover rounded-lg"
					/>
				</div>
			</div>
		</section>
	)
}

export default StorySharing;