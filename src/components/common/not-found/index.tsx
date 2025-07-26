'use client'

import { useLocationController } from "@/services/location-controller";
import { Location } from "@/types/Location";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FaHome, FaCompass, FaRegMap } from "react-icons/fa";

const NotFoundPage = () => {

	const { getAllLocation } = useLocationController()
	const [attractions, setAttractions] = React.useState<Location[]>([])
	const router = useRouter()

	const fetchLocation = async () => {
		try {
			const response = await getAllLocation()
			setAttractions(response)
		} catch (error) {
			console.error('Error fetching location:', error)
		}
	}

	useEffect(() => {
		fetchLocation()
	}, [])

	return (
		<>
			<Head>
				<title>404</title>
				<meta
					name="description"
					content="Oops! Trang bạn tìm kiếm không tồn tại. Cùng khám phá Tây Ninh – vùng đất của vẻ đẹp thiên nhiên và văn hóa."
				/>
			</Head>

			<div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-6xl font-bold text-red-800 mb-4">404</h1>
						<p className="text-2xl text-gray-700 mb-6">Hmmm! Bạn đã lạc nhịp đôi chút rồi.</p>
						<p className="text-lg text-gray-600">Trong lúc chờ tìm đường, sao không ghé thăm Tây Ninh – nơi thiên nhiên và lịch sử tuyệt vời?</p>
					</div>

					<div className="relative overflow-hidden rounded-xl mb-12">
						<Image
							src="/Banner.png"
							alt="Tây Ninh Landscape"
							width={400}
							height={400}
							className="w-full h-[400px] object-cover rounded-xl shadow-lg"
						/>
						<div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
							<div className="text-white text-center p-6">
								<h2 className="text-3xl font-bold mb-4">Khám phá Tây Ninh</h2>
								<p className="text-lg">Nơi tinh hoa văn hóa cổ xưa hòa mình vào vẻ đẹp thiên nhiên kỳ vĩ.</p>
							</div>
						</div>
					</div>

					<div className="grid md:grid-cols-3 gap-8 mb-12">
						{attractions.slice(0, 3).map((attraction, index) => (
							<div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
								<img
									src={(attraction?.medias?.[0]?.mediaUrl) || '/fallback.jpg'}
									alt={attraction?.name}
									className="w-full h-48 object-cover"
								/>
								<div className="p-6">
									<h3 className="text-xl font-semibold text-gray-800 mb-2">{attraction?.name}</h3>
									<p className="text-gray-600">{attraction?.description}</p>
								</div>
							</div>
						))}
					</div>

					<div className="flex flex-col items-center gap-6">
						<button onClick={() => router.push('/')} className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-full flex items-center gap-2 transform hover:scale-105 transition-all duration-300">
							<FaHome className="text-xl" />
							Trở về trang chủ
						</button>

						<div className="flex gap-4">
							<Link href='/kham-pha'>
								<div className="flex items-center gap-2 text-gray-600 hover:text-red-700 transition-colors duration-300 cursor-pointer">
									<FaCompass className="text-xl" />
									Khám phá thêm
								</div>
							</Link>
							<Link href='https://maps.app.goo.gl/xpTrDECcuAx1R7mZ9' target='_blank'>
								<div className="flex items-center gap-2 text-gray-600 hover:text-red-700 transition-colors duration-300 cursor-pointer">
									<FaRegMap className="text-xl" />
									Xem bản đồ tỉnh
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NotFoundPage;