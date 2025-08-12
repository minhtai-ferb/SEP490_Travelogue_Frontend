import { Metadata } from "next"
import CraftVillageClient from "./CraftVillageClient"

export const metadata: Metadata = {
	title: 'Làng nghề',
	description: 'Làng nghề',
	openGraph: {
		title: 'Làng nghề',
		description: 'Làng nghề',
		images: ['/images/og-image.png'],
	},
}

function page() {
	return (
		<div>
			<CraftVillageClient />
		</div>
	)
}
export default page
