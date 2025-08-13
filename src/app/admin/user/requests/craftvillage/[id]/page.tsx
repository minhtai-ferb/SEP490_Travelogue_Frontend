import { Metadata } from "next"
import CraftVillageClient from "./CraftVillageClient"


export const metadata: Metadata = {
	title: "Chi tiết đơn đăng ký làng nghề",
	description: "Chi tiết đơn đăng ký làng nghề",
}

function page({ params }: { params: { id: string } }) {
	const { id } = params

	return (
		<div>
			<CraftVillageClient id={id} />
		</div>
	)
}

export default page
