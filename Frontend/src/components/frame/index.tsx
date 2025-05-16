import React from 'react';
import { ShineBorder } from '../magicui/shine-border';
import Link from 'next/link';

interface FrameProps {
	image: string;
	title: string;
	className?: string;
}

const Frame = ({ image, title, className }: FrameProps) => {
	return (
		<div className={`relative rounded-lg h-64 w-full bg-cover bg-center hover:bg-scale-105 cursor-pointer ${className || ''}`} style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-lg">
				<div className="flex items-center">
					<div className="bg-white h-10 w-2 mr-2"></div>
					<h2 className="text-white text-base font-bold">
						{title.length > 60 ? title.slice(0, 60) + '...' : title}
					</h2>
				</div>
			</div>
		</div>
	);
};

export default Frame;
