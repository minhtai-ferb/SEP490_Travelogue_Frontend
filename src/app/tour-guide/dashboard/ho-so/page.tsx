import type { Metadata } from "next"
import AccountClient from "./account-client"

export const metadata: Metadata = {
	title: "Tài khoản & Chứng chỉ hướng dẫn viên",
	description: "Cập nhật thông tin cá nhân, mật khẩu, chứng chỉ theo giao diện thân thiện.",
	robots: { index: false, follow: false },
}

export default function Page() {
	return <AccountClient />
}
