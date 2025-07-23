'use client'

import { BoxReveal } from '@/components/magicui/box-reveal';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import UnifiedHeader from '@/components/common/common-header';
import { headerConfigs } from '@/config/header';
import { useAuth } from '@/services/useAuth';
import { userAtom } from '@/store/auth';
import { useAtom } from 'jotai';
function Header() {
	const textRef = useRef<HTMLParagraphElement>(null);

	return (
		<>
			<div className={`w-full h-screen relative bg-gradient-to-br overflow-hidden`}>
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: `url('/thien_nhien.png')`,
						backgroundBlendMode: 'overlay',
					}}
				/>

				<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

				<UnifiedHeader config={headerConfigs?.home} />
				<div className="w-full mt-36 py-3 flex flex-col items-center justify-center text-center z-20">

					<div className="min-h-[100px] sm:min-h-[120px] flex items-center py-4">
						<BoxReveal boxColor="#ffffff" duration={0.8} width="fit-content" className='h-full'>
							<h1
								ref={textRef}
								className="text-3xl sm:text-4xl py-5 md:text-5xl lg:text-6xl text-white font-extrabold drop-shadow-md animate-slideDown tracking-wide break-words"
							>
								Địa điểm yêu thích của bạn
							</h1>
						</BoxReveal>
					</div>
				</div>
			</div >
		</>
	);
}

export default Header;