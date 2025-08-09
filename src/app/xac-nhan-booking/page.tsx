import type { Metadata } from "next"
import BookingConfirmationClient from "@/components/page/booking-confirmation"

// Dynamic metadata
export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>
}): Promise<Metadata> {
	const resolvedSearchParams = await searchParams
	const bookingId = resolvedSearchParams.bookingId

	// You can fetch booking data here if needed
	// const booking = await fetchBookingById(bookingId)

	return {
		title: `Xác nhận đặt tour #${bookingId?.split("-")[1] || ""} | Travelogue`,
		description: `Đặt tour thành công! Xem chi tiết booking và hướng dẫn thanh toán qua ứng dụng mobile.`,
		keywords: ["xác nhận đặt tour", "booking confirmation", "thanh toán tour", "du lịch"],
		openGraph: {
			title: `Đặt tour thành công #${bookingId?.split("-")[1] || ""} - Travelogue`,
			description: "Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Hãy tải app để hoàn tất thanh toán.",
			type: "website",
			url: `/booking-confirmation?bookingId=${bookingId}`,
			images: [
				{
					url: "/og-booking-success.jpg",
					width: 1200,
					height: 630,
					alt: "Đặt tour thành công - Travelogue",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `Đặt tour thành công #${bookingId?.split("-")[1] || ""} - Travelogue`,
			description: "Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Hãy tải app để hoàn tất thanh toán.",
			images: ["/og-booking-success.jpg"],
		},
		robots: {
			index: false, // Don't index confirmation pages
			follow: false,
		},
	}
}

export default async function BookingConfirmationPage() {
	return <BookingConfirmationClient />
}
