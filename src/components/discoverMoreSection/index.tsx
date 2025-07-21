import Link from "next/link";
import { Pointer } from "../ui/pointer";
import { motion } from "motion/react";

interface DiscoverSectionProps {
	imageUrl: string;
	id: string;
	description: string;
	height?: string;
}

function DiscoverSection({ id, imageUrl, description, height = '250px' }: DiscoverSectionProps) {
	return (
		<Link href={`/trai-nghiem/thong-tin/${id}`}>
			<div
				className="relative flex flex-col rounded-xl w-full max-w-[15rem] sm:max-w-[18rem] md:max-w-[20rem] lg:w-60 group"
				style={{
					backgroundImage: `url("${imageUrl}")`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					height,
				}}
			>
				{/* Overlay */}
				<div className="absolute top-0 left-0 right-0 bottom-0 rounded-2xl bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

				{/* Content */}
				<div className="flex z-10 items-center gap-2 sm:gap-3 mt-auto py-2 sm:py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<div className="h-8 w-2 sm:h-10 sm:w-3 bg-white"></div>
					<p className="text-white text-base sm:text-lg font-medium">
						{description.length >= 45 ? description.slice(0, 45) + "..." : description}
					</p>
				</div>
				<Pointer>
					<motion.div
						animate={{
							scale: [0.8, 1, 0.8],
							rotate: [0, 5, -5, 0],
						}}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						<svg
							width="40"
							height="40"
							viewBox="0 0 40 40"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="text-pink-600"
						>
							<motion.path
								d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
								fill="currentColor"
								animate={{ scale: [1, 1.2, 1] }}
								transition={{
									duration: 0.8,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
						</svg>
					</motion.div>
				</Pointer>
			</div>
		</Link>
	);
}

export default DiscoverSection;