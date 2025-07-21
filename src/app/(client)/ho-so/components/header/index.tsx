"use client";

import UnifiedHeader from "@/components/common/common-header";
import { headerConfigs } from "@/config/header";

export default function Header() {
	return (
		<div className="w-full h-[150px] md:h-[200px] relative overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-no-repeat bg-center bg-cover"
				style={{
					backgroundImage: "url('/thien_nhien.png')",
				}}
			/>

			{/* Semi-opaque overlay (optional) */}
			<div className="absolute inset-0 bg-black/20" />

			{/* Nav on top */}
			<UnifiedHeader
				config={headerConfigs?.home}
			/>
		</div>
	);
}
