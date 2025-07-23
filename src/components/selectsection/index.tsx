import React from 'react';

type SelectSectionProps = {
	icon?: React.ReactNode;
	title: string;
	color: string;
	onClick?: () => void; // Add this line
};

function SelectSection({ icon, title, color, onClick }: SelectSectionProps) {
	return (
		<section className={`flex flex-col gap-2 items-center justify-center w-20 h-20 md:w-36 md:h-36 rounded-full border-2 border-${color} bg-white transition-all duration-300 hover:cursor-pointer hover:border-red-500`} onClick={onClick}>
			<div className={`flex flex-col gap-3 items-center justify-center w-16 h-16 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-${color} bg-white transition-all duration-300 hover:cursor-pointer`}>
				<span className="text-base md:text-2xl">
					{icon}
				</span>
				<p className="text-xs md:text-sm text-center">{title}</p>
			</div>
		</section>
	);
}

export default SelectSection;
