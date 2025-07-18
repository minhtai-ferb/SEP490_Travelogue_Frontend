
import MyToursContent from '@/components/page/tour-guide/tourguide-tours/assign-tour'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: "Tour của tôi | Travelogue",
	description: "Quản lý các tour được phân công",
	robots: {
		index: false,
		follow: false,
	},
}

export default function Page() {
	// const user = useAtom(userAtom)
	return (
		<div>
			<MyToursContent />
		</div>
	)
}
