"use client"

import ProfessionalApplicationForm from "./components/RequestBecomeCraftVillageForm"
// CraftVillageFlow
export default function CraftVillageClient({ fetchLatest }: { fetchLatest: () => void }) {
	return <ProfessionalApplicationForm fetchLatest={fetchLatest} />
}

