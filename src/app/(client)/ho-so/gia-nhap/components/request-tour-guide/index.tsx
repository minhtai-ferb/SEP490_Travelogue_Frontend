"use client"

import RegisterTourGuideRequestForm from "./register-form"


export default function TourGuideForm({ fetchLatest }: { fetchLatest: () => void }) {
    return <RegisterTourGuideRequestForm fetchLatest={fetchLatest} />
}


