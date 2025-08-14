import DiscoverSection from '@/components/discoverMoreSection'
import { useNews } from '@/services/use-news'
import { Experience } from '@/types/News'
import React, { useEffect, useState } from 'react'
import { toAbsoluteUrl } from '@/lib/url'

function DiscoverMore() {

	const [data, setData] = useState<Experience[]>([])

	const { getPagedExperiences } = useNews()

	const fetchExperience = async () => {
		try {
			const res = await getPagedExperiences({
				pageNumber: 1,
				pageSize: 100,
			})
			// Shuffle the array to randomize the experiences
			const shuffled = res.data.sort(() => 0.5 - Math.random())
			// Select only the first 4 experiences
			const selected = shuffled.slice(0, 4)
			setData(selected)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchExperience()
	}, [])


	return (
		<div className='my-20 flex flex-col gap-10'>
			<p className='text-2xl lg:text-5xl font-bold text-center text-blue-500'>Khám phá thêm</p>

			<div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 mx-auto'>
				{data?.map((item, index) => (
					<DiscoverSection
						key={index}
						id={item.id}
						title={item.title}
						imageUrl={toAbsoluteUrl(item?.medias?.[0]?.mediaUrl)}
					/>
				))}
			</div>

		</div>
	)
}

export default DiscoverMore