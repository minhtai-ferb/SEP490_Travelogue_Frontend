"use client"

import RegisterCraftVillageRequestForm from "./RegisterCraftVillageRequestForm"

export default function CraftVillageForm({ fetchLatest }: { fetchLatest: () => void }) {
	return <RegisterCraftVillageRequestForm fetchLatest={fetchLatest} />
}


