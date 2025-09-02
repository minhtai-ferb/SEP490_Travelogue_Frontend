import BreadcrumbHeader from '@/components/common/breadcrumb-header'
import React from 'react'

function page() {
	const items = [
		{ label: 'Dashboard', href: '/' },
		{ label: 'Craft Village', href: '/craft-village' },
		{ label: 'Hồ sơ', href: '/craft-village/profile' },
	]

	return (
		<div>
			<BreadcrumbHeader items={items} />
			ho so lang nghe
		</div>
	)
}

export default page