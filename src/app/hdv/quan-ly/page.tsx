import type { Metadata } from "next"
import ManagerClient from "./component/mangage-client"

export const metadata: Metadata = {
	title: "Trung tâm Quản lý Hướng dẫn viên",
	description: "Quản lý tour, trip plan theo giao diện thân thiện.",
	robots: { index: false, follow: false },
}

export default function Page() {
	return <ManagerClient />
}
