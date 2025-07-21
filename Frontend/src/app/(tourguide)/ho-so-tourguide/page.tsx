import GuideProfileContent from "@/components/page/tour-guide/tourguide-profile/index."
import { Metadata } from "next"


export const metadata: Metadata = {
	title: "Hồ sơ cá nhân | Travelogue",
	description: "Quản lý thông tin hồ sơ hướng dẫn viên",
	robots: {
		index: false,
		follow: false,
	},
}

export default function GuideProfilePage() {
	return <GuideProfileContent />
}
