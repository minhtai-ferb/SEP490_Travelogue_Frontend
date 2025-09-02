import { Metadata } from "next"
import ScheduleTourguideCL from "./ScheduleTourguideCL"
import ScheduleTourguideRefactored from "./ScheduleTourguideRefactored"

export const metadata: Metadata = {
	title: "Lịch trình",
	description: "Lịch trình",
}
function LichTrinhPage() {
	return (
		<div>
			<ScheduleTourguideRefactored />
		</div>
	)
}

export default LichTrinhPage
