"use client"

import ProfessionalApplicationForm, { ApplicationFormData } from "./components/ProfessionalApplicationForm"
export default function CraftVillageClient({ fetchLatest }: { fetchLatest: () => void }) {

	const onSubmit = (data: ApplicationFormData) => {
		console.log(data)
	}

	return <ProfessionalApplicationForm onSubmit={onSubmit} isLoading={false} />
}

