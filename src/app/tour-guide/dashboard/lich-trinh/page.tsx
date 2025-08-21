import { Metadata } from "next"
import ScheduleTourguideCL from "./ScheduleTourguideCL"

export const metadata: Metadata = {
	title: "Lịch trình",
	description: "Lịch trình",
}
function LichTrinhPage() {
	return (
		<div>
			<ScheduleTourguideCL />
		</div>
	)
}

export default LichTrinhPage
