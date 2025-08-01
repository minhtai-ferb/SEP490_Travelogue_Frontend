import TourManagement from '@/components/tour-management/TourManagement'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Tour Management',
	description: 'Manage your tours efficiently with the Tour Management dashboard.',
	keywords: ['tour', 'management', 'dashboard', 'admin'],
	openGraph: {
		title: 'Tour Management Dashboard',
		description: 'Efficient tour management system',
		url: 'https://traveloge.com/admin/tours',
		siteName: 'Traveloge',
		type: 'website',
	},
	metadataBase: new URL('https://traveloge.com/admin/tour'),
}


function page() {
	return (
		<div className=''>
			<TourManagement />
		</div>
	)
}

export default page
