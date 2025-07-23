"use client"

import { TravelogueButton } from "../avatar-button"


export function TravelogueButtonExamples() {
	return (
		<div className="flex flex-col gap-8 w-full max-w-md">
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Default Style (Matching Image)</h2>
				<TravelogueButton
					icon={
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3DB2FF]">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-5 w-5">
								<path
									fillRule="evenodd"
									d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
					}
					label="Travelogue"
					className="bg-white/90 text-gray-700 font-medium"
				/>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Size Variations</h2>
				<div className="flex flex-col gap-3">
					<TravelogueButton
						icon={
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3DB2FF]">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-3 w-3">
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						}
						label="Small Button"
						size="sm"
						className="bg-white/90 text-gray-700 font-medium"
					/>

					<TravelogueButton
						icon={
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3DB2FF]">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-5 w-5">
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						}
						label="Medium Button"
						size="md"
						className="bg-white/90 text-gray-700 font-medium"
					/>

					<TravelogueButton
						icon={
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3DB2FF]">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-6 w-6">
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						}
						label="Large Button"
						size="lg"
						className="bg-white/90 text-gray-700 font-medium"
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Color Variations</h2>
				<div className="flex flex-col gap-3">
					<TravelogueButton
						icon={
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-5 w-5">
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						}
						label="Blue Icon"
						className="bg-white/90 text-gray-700 font-medium"
					/>

					<TravelogueButton
						icon={
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-5 w-5">
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						}
						label="Green Icon"
						className="bg-white/90 text-gray-700 font-medium"
					/>

					<TravelogueButton
						icon={
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-5 w-5">
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						}
						label="Purple Icon"
						className="bg-white/90 text-gray-700 font-medium"
					/>
				</div>
			</div>
		</div>
	)
}

