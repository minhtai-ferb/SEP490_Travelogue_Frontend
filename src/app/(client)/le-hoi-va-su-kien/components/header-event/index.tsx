import { BoxReveal } from '@/components/magicui/box-reveal';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { useRef } from 'react';

import UnifiedHeader from '@/components/common/common-header';
import { headerConfigs } from '@/config/header';
function Header() {
	const textRef = useRef<HTMLParagraphElement>(null);

	const handleExploreClick = () => {
		document.getElementById('tin-tuc-su-kien')?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div className="min-h-screen bg-background relative">
			<header
				className="relative h-screen w-full bg-cover bg-center flex flex-col"
				style={{ backgroundImage: "url('/event_bg.png')" }}
			>
				{/* Single full‐screen overlay */}
				<div className="absolute inset-0 bg-black/40 z-10"></div>

				{/* Nav on top of overlay */}
				<UnifiedHeader
					config={headerConfigs?.news}
				/>

				{/* Hero content */}
				<div className="relative z-20 mt-20 flex flex-col items-center justify-center text-center px-4 space-y-6">
					<BoxReveal boxColor="#ffffff" duration={0.8} width="fit-content">
						<h1
							ref={textRef}
							className="py-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-extrabold drop-shadow-md animate-slideDown tracking-wide"
						>
							Trang Lễ Hội và Sự Kiện Tỉnh Tây Ninh
						</h1>
					</BoxReveal>

					<BoxReveal boxColor="#ffffff" duration={0.9} width="fit-content">
						<p className="text-lg sm:text-xl md:text-2xl text-white font-semibold drop-shadow-md animate-fadeIn tracking-wide">
							Cập nhật nhanh chóng về văn hóa, lễ hội và sự kiện nổi bật
						</p>
					</BoxReveal>

					<BoxReveal boxColor="#ffcc00" duration={1.0} width="fit-content">
						<ShinyButton
							onClick={handleExploreClick}
							className="px-6 sm:px-8 py-3 sm:py-4 bg-[#ffcc00] text-[#2e6fb8] font-bold rounded-lg shadow-xl hover:bg-[#e6b800] hover:shadow-2xl transition-transform duration-300 transform hover:scale-105"
						>
							Xem Các Sự Kiện Nổi Bật
						</ShinyButton>
					</BoxReveal>
				</div>
			</header>
		</div>

	);
}

export default Header;