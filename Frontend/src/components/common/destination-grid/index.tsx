'use client'

import { useLocationController } from "@/services/location-controller";
import { Location } from "@/types/Location";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import chuagoken from "../../../../public/image/chuagoken.jpg";
import dinhhiepninh from "../../../../public/image/dinhhiepninh.jpg";
import thitrangodau from "../../../../public/image/thitrangodau.jpg";
import thixahoathanh from "../../../../public/image/thixahoathanh.jpg";

export default function DestinationGrid() {

	const [location, setLocation] = useState<Location[]>([])
	const { searchLocation } = useLocationController()

	const handleSearchLocation = async () => {
		try {
			const response = await searchLocation(
				{
					pageNumber: 1,
					pageSize: 5
				}
			)

			console.log('====================================');
			console.log("Location exp", response);
			console.log('====================================');
			setLocation(response?.data)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		handleSearchLocation()
	}, [])

	return (
		<div className="container px-6 mx-auto py-12">
			<h2 className="text-4xl font-bold mb-8 text-center text-blue-500">Khám phá Tây Ninh</h2>

			<div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4">
				{/* Large card - spans 2 columns and 2 rows on desktop */}
				<div className="md:col-span-2 md:row-span-2 relative rounded-lg overflow-hidden group">
					{location?.length > 0 &&
						<Link href={`/trai-nghiem/${location[0]?.id}`}>
							<Image
								src={location?.[0]?.medias?.[1]?.mediaUrl || '/image/tuahai.jpg'}
								alt="Thành phố Tây Ninh"
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
							<div className="absolute bottom-0 left-0 p-4 text-white">
								<h3 className="text-lg font-bold uppercase">{location[0]?.name}</h3>
							</div>
						</Link>
					}
				</div>

				{location && (
					location?.slice(1, 5).map((item) => (
						<div className="relative rounded-lg overflow-hidden group aspect-square" key={item.id}>
							<Link href={`/trai-nghiem/${item?.id}`}>
								<Image
									src={item?.medias?.[1]?.mediaUrl || dinhhiepninh}
									alt="Din hiep ninh"
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
								<div className="absolute bottom-0 left-0 p-3 text-white">
									<h3 className="text-xs font-bold uppercase">{item?.name?.length > 50 ? item?.name?.slice(0, 50) + '...' : item?.name}</h3>
								</div>
							</Link>
						</div>
					))
				)}
			</div>
		</div>
	);
}