'use client'

import { BoxReveal } from '@/components/magicui/box-reveal';
import { useRef } from 'react';
import UnifiedHeader from '@/components/common/common-header';
import { headerConfigs } from '@/config/header';
function Header() {
	const textRef = useRef<HTMLParagraphElement>(null);

	return (
		<>
			<div className={`w-full h-full relative bg-gradient-to-br overflow-hidden`}>
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: `url('/thien_nhien.png')`,
						backgroundBlendMode: 'overlay',
					}}
				/>

				<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

				<UnifiedHeader config={headerConfigs?.home} />

				<div className="w-full h-full flex flex-col items-center justify-center text-center py-10 px-4 z-20">

					<div className="min-h-[100px] sm:min-h-[120px] -mt-20 flex items-center py-3">
						<BoxReveal boxColor="#ffffff" duration={0.8} width="fit-content" className='h-full'>
							<h1
								ref={textRef}
								className="text-xl py-3 sm:text-4xl md:text-5xl lg:text-3xl text-white font-bold drop-shadow-md animate-slideDown tracking-wide break-words"
							>
								Hành trình mới, trải nghiệm mới <br /> Cùng khám phá những điểm đến ấn tượng!
							</h1>
						</BoxReveal>
					</div>
				</div>
			</div>
		</>
	);
}

export default Header;