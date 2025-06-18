import React, { useState } from "react";
import { FaCompass, FaPlane } from "react-icons/fa";

interface TravelCTAProps {
	onClick?: () => void;
}

const TravelCTA: React.FC<TravelCTAProps> = ({ onClick }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleClick = async () => {
		setIsLoading(true);
		await onClick?.(); // Call the onClick prop if provided
		setIsLoading(false);
		setIsSuccess(true);
	};

	return (
		<div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
			<button
				disabled={isLoading}
				onClick={handleClick}
				className={`
          group relative flex items-center justify-center gap-3
          px-8 py-4 md:px-10 md:py-5
          text-lg md:text-xl font-semibold tracking-wide
          text-white uppercase
          bg-gradient-to-r from-blue-500 to-purple-600
          rounded-full
          transition-all duration-300 transform
          hover:scale-105 hover:shadow-xl
          focus:outline-none focus:ring-4 focus:ring-blue-300
          disabled:opacity-70 disabled:cursor-not-allowed
          ${isSuccess ? 'bg-green-500' : ''}
        `}
			>
				<FaPlane
					className={`
            text-2xl transition-transform duration-300
            group-hover:-rotate-12 group-hover:translate-x-1
          `}
				/>
				<span className="relative">
					{isLoading ? "Processing..." : isSuccess ? "Booked Successfully!" : "Book Your Adventure"}
				</span>
				<FaCompass
					className={`
            text-2xl transition-transform duration-300
            group-hover:rotate-90
          `}
				/>

				{/* Sparkle Shine Effect */}
				<div className="absolute inset-0 -z-10 overflow-hidden rounded-full">
					<div className="
            absolute top-1/2 left-1/2 w-full h-full
            -translate-x-1/2 -translate-y-1/2
            bg-gradient-to-r from-transparent via-white/20 to-transparent
            animate-[shine_1.5s_infinite]
            rotate-45
          "></div>
				</div>
			</button>
		</div>
	);
};

export default TravelCTA;
