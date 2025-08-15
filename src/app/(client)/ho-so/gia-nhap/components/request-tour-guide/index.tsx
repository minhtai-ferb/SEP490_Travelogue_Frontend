"use client"

import RegisterTourGuideRequestForm from "./register-form"


export default function CraftVillageForm({ fetchLatest }: { fetchLatest: () => void }) {
	return <RegisterTourGuideRequestForm fetchLatest={fetchLatest} />
}


