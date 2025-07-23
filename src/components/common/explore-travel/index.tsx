import background from "../../../../public/image/image.png"

interface SectionExploreTravelProps {
	text: string;
	backgroundImage?: string;
	className?: string;
}

export const SectionExploreTravel = ({
	text,
	backgroundImage = "/image/image/background.jpg",
	className = ""
}: SectionExploreTravelProps) => {
	return (
		<div
			className={`py-20 relative flex items-center justify-center ${className}`}
			style={{
				backgroundImage: `url(${background.src})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				minHeight: '200px',
				padding: '0 4rem',
			}}
		>
			<div className="absolute inset-0 bg-black bg-opacity-40"></div>
			<div className="relative z-10 text-center max-w-3xl mx-auto">
				<p className="text-white text-xl md:text-2xl font-medium">
					{text}
				</p>
			</div>
		</div>
	)
}
