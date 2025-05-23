"use client"

import { useState } from "react"
import {
	Calendar,
	Clock,
	Users,
	MapPin,
	Star,
	User,
	Phone,
	Mail,
	CreditCard,
	CheckCircle,
	ChevronRight,
	Camera,
	Coffee,
	Compass,
	Shield,
} from "lucide-react"
import Image from "next/image"

const TourBookingInterface = () => {
	const [currentStep, setCurrentStep] = useState(1)
	const [bookingData, setBookingData] = useState({
		groupType: "",
		participants: 1,
		date: "",
		timeSlot: "",
		contactInfo: {
			name: "",
			email: "",
			phone: "",
		},
	})

	const tourInfo = {
		name: "Historic City Walking Tour",
		duration: "3 hours",
		rating: 4.8,
		reviews: 324,
		description: "Explore the city's rich history with our expert guides through iconic landmarks and hidden gems.",
		inclusions: ["Professional tour guide", "Historical insights", "Photo opportunities", "Small group experience"],
		meetingPoint: "Central Plaza Fountain",
	}

	const pricing = {
		solo: 85,
		group: 65,
	}

	const timeSlots = ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM", "6:00 PM - 9:00 PM"]

	const handleStepComplete = () => {
		if (currentStep < 4) {
			setCurrentStep(currentStep + 1)
			// Scroll to top when changing steps
			window.scrollTo({ top: 0, behavior: "smooth" })
		}
	}

	const handlePreviousStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1)
			// Scroll to top when changing steps
			window.scrollTo({ top: 0, behavior: "smooth" })
		}
	}

	const handleGroupTypeChange = (type: string) => {
		setBookingData({
			...bookingData,
			groupType: type,
			participants: type === "solo" ? 1 : 2,
		})
	}

	const calculateTotal = () => {
		const basePrice = bookingData.groupType === "solo" ? pricing.solo : pricing.group
		return basePrice * bookingData.participants
	}

	const StepIndicator = () => (
		<div className="flex items-center justify-center mb-8">
			{[1, 2, 3, 4].map((step) => (
				<div key={step} className="flex items-center">
					<div
						className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
            ${step < currentStep ? "bg-green-500 text-white" : step === currentStep ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-gray-100 text-gray-400"}`}
					>
						{step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
					</div>
					{step < 4 && (
						<div className={`w-20 h-1 mx-1 transition-all ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
					)}
				</div>
			))}
		</div>
	)

	const TourOverview = () => (
		<div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6 transition-all hover:shadow-lg">
			<div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
				<Image src="/placeholder.svg?height=400&width=800" alt="Tour Preview" className="object-cover" fill />
				<div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
					Popular
				</div>
			</div>

			<div className="flex items-start justify-between mb-4">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">{tourInfo.name}</h2>
					<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
						<div className="flex items-center gap-1">
							<Clock className="w-4 h-4 text-blue-600" />
							{tourInfo.duration}
						</div>
						<div className="flex items-center gap-1">
							<Star className="w-4 h-4 text-yellow-500" />
							{tourInfo.rating} ({tourInfo.reviews} reviews)
						</div>
						<div className="flex items-center gap-1">
							<MapPin className="w-4 h-4 text-blue-600" />
							{tourInfo.meetingPoint}
						</div>
					</div>
				</div>
				<div className="text-right">
					<div className="text-sm text-gray-500">Starting from</div>
					<div className="text-2xl font-bold text-blue-600">${pricing.group}</div>
					<div className="text-sm text-gray-500">per person</div>
				</div>
			</div>

			<p className="text-gray-700 mb-6 leading-relaxed">{tourInfo.description}</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h4 className="font-semibold text-gray-900 mb-3 flex items-center">
						<CheckCircle className="w-4 h-4 text-green-500 mr-2" />
						What's Included
					</h4>
					<ul className="text-sm text-gray-600 space-y-2">
						{tourInfo.inclusions.map((item, index) => (
							<li key={index} className="flex items-center gap-2">
								<div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
								{item}
							</li>
						))}
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-gray-900 mb-3 flex items-center">
						<User className="w-4 h-4 text-blue-600 mr-2" />
						Tour Guide Assignment
					</h4>
					<p className="text-sm text-gray-600 leading-relaxed">
						Professional tour guide will be automatically assigned based on group size and language preference.
					</p>
				</div>
			</div>
		</div>
	)

	const Step1GroupSelection = () => (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold text-gray-900 flex items-center">
				<Users className="w-5 h-5 text-blue-600 mr-2" />
				Choose Your Tour Experience
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div
					className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md
            ${bookingData.groupType === "solo" ? "border-blue-600 bg-blue-50/50 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
					onClick={() => handleGroupTypeChange("solo")}
				>
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
							<User className="w-6 h-6 text-blue-600" />
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-gray-900">${pricing.solo}</div>
							<div className="text-sm text-gray-500">per person</div>
						</div>
					</div>
					<h4 className="text-lg font-semibold text-gray-900 mb-2">Solo Experience</h4>
					<p className="text-gray-600 text-sm mb-4 leading-relaxed">
						Perfect for individual travelers seeking a personalized experience with dedicated attention from your guide.
					</p>
					<ul className="text-sm text-gray-600 space-y-2">
						<li className="flex items-center">
							<CheckCircle className="w-4 h-4 text-green-500 mr-2" />
							Individual attention
						</li>
						<li className="flex items-center">
							<CheckCircle className="w-4 h-4 text-green-500 mr-2" />
							Flexible pace
						</li>
						<li className="flex items-center">
							<CheckCircle className="w-4 h-4 text-green-500 mr-2" />
							Personalized insights
						</li>
					</ul>
				</div>

				<div
					className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md
            ${bookingData.groupType === "group" ? "border-blue-600 bg-blue-50/50 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
					onClick={() => handleGroupTypeChange("group")}
				>
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
							<Users className="w-6 h-6 text-green-600" />
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-gray-900">${pricing.group}</div>
							<div className="text-sm text-gray-500">per person</div>
							<div className="text-xs text-green-600 font-medium">Save ${pricing.solo - pricing.group} per person!</div>
						</div>
					</div>
					<h4 className="text-lg font-semibold text-gray-900 mb-2">Group Experience</h4>
					<p className="text-gray-600 text-sm mb-4 leading-relaxed">
						Ideal for families, friends, or couples wanting to share the experience together at a discounted rate.
					</p>
					<ul className="text-sm text-gray-600 space-y-2">
						<li className="flex items-center">
							<CheckCircle className="w-4 h-4 text-green-500 mr-2" />
							Shared experience
						</li>
						<li className="flex items-center">
							<CheckCircle className="w-4 h-4 text-green-500 mr-2" />
							Cost-effective
						</li>
						<li className="flex items-center">
							<CheckCircle className="w-4 h-4 text-green-500 mr-2" />
							Social interaction
						</li>
					</ul>
				</div>
			</div>

			{bookingData.groupType === "group" && (
				<div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
					<label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
						<Users className="w-4 h-4 text-blue-600 mr-2" />
						Number of Participants
					</label>
					<div className="flex items-center">
						<select
							className="border border-gray-300 rounded-lg px-4 py-2.5 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							value={bookingData.participants}
							onChange={(e) => setBookingData({ ...bookingData, participants: Number.parseInt(e.target.value) })}
						>
							{[2, 3, 4, 5, 6, 7, 8].map((num) => (
								<option key={num} value={num}>
									{num} people
								</option>
							))}
						</select>
						<div className="ml-4 text-sm text-gray-500 hidden md:block">
							Total: <span className="font-semibold text-blue-600">${pricing.group * bookingData.participants}</span>
						</div>
					</div>
				</div>
			)}

			<div className="flex justify-between pt-4">
				<button onClick={() => { }} className="text-gray-500 hover:text-gray-700 font-medium flex items-center">
					Cancel
				</button>
				<button
					onClick={handleStepComplete}
					disabled={!bookingData.groupType}
					className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
				>
					Continue to Date & Time
					<ChevronRight className="w-4 h-4 ml-1" />
				</button>
			</div>
		</div>
	)

	const Step2DateTime = () => (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold text-gray-900 flex items-center">
				<Calendar className="w-5 h-5 text-blue-600 mr-2" />
				Select Date & Time
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
					<label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
						<Calendar className="w-4 h-4 text-blue-600 mr-2" />
						Choose Date
					</label>
					<input
						type="date"
						className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						value={bookingData.date}
						onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
						min={new Date().toISOString().split("T")[0]}
					/>
				</div>

				<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
					<label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
						<Clock className="w-4 h-4 text-blue-600 mr-2" />
						Choose Time Slot
					</label>
					<select
						className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						value={bookingData.timeSlot}
						onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
					>
						<option value="">Select time slot</option>
						{timeSlots.map((slot, index) => (
							<option key={index} value={slot}>
								{slot}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
				<div className="flex items-start">
					<div className="flex-shrink-0 mt-1">
						<Shield className="w-5 h-5 text-blue-600" />
					</div>
					<div className="ml-3">
						<h4 className="font-semibold text-blue-900 mb-2">Tour Guide Assignment</h4>
						<p className="text-blue-800 text-sm leading-relaxed">
							Your professional tour guide will be automatically assigned based on your selected date, time, and group
							size. You'll receive guide details 24 hours before your tour.
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<button
					onClick={handlePreviousStep}
					className="border border-gray-300 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
				>
					Back
				</button>
				<button
					onClick={handleStepComplete}
					disabled={!bookingData.date || !bookingData.timeSlot}
					className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
				>
					Continue to Contact Information
					<ChevronRight className="w-4 h-4 ml-1" />
				</button>
			</div>
		</div>
	)

	const Step3ContactInfo = () => (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold text-gray-900 flex items-center">
				<User className="w-5 h-5 text-blue-600 mr-2" />
				Contact Information
			</h3>

			<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
							<User className="w-4 h-4 text-blue-600 mr-2" />
							Full Name
						</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							value={bookingData.contactInfo.name}
							onChange={(e) =>
								setBookingData({
									...bookingData,
									contactInfo: { ...bookingData.contactInfo, name: e.target.value },
								})
							}
							placeholder="Enter your full name"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
							<Phone className="w-4 h-4 text-blue-600 mr-2" />
							Phone Number
						</label>
						<input
							type="tel"
							className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							value={bookingData.contactInfo.phone}
							onChange={(e) =>
								setBookingData({
									...bookingData,
									contactInfo: { ...bookingData.contactInfo, phone: e.target.value },
								})
							}
							placeholder="Enter your phone number"
						/>
					</div>
				</div>

				<div className="mt-6">
					<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
						<Mail className="w-4 h-4 text-blue-600 mr-2" />
						Email Address
					</label>
					<input
						type="email"
						className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						value={bookingData.contactInfo.email}
						onChange={(e) =>
							setBookingData({
								...bookingData,
								contactInfo: { ...bookingData.contactInfo, email: e.target.value },
							})
						}
						placeholder="Enter your email address"
					/>
				</div>
			</div>

			<div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
				<div className="flex items-start">
					<div className="flex items-center h-5">
						<input
							id="special-requests"
							type="checkbox"
							className="w-4 h-4 border border-gray-300 rounded focus:ring-blue-500"
						/>
					</div>
					<div className="ml-3">
						<label htmlFor="special-requests" className="text-sm font-medium text-gray-700">
							I have special requests or requirements
						</label>
						<p className="text-xs text-gray-500 mt-1">
							Check this box if you have any accessibility needs, dietary restrictions, or other special requirements.
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<button
					onClick={handlePreviousStep}
					className="border border-gray-300 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
				>
					Back
				</button>
				<button
					onClick={handleStepComplete}
					disabled={!bookingData.contactInfo.name || !bookingData.contactInfo.email || !bookingData.contactInfo.phone}
					className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
				>
					Continue to Payment
					<ChevronRight className="w-4 h-4 ml-1" />
				</button>
			</div>
		</div>
	)

	const Step4Payment = () => (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold text-gray-900 flex items-center">
				<CreditCard className="w-5 h-5 text-blue-600 mr-2" />
				Review & Payment
			</h3>

			<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
				<h4 className="font-semibold text-gray-900 mb-4 flex items-center">
					<CheckCircle className="w-4 h-4 text-green-500 mr-2" />
					Booking Summary
				</h4>
				<div className="space-y-4 text-sm">
					<div className="flex justify-between items-center pb-2 border-b border-gray-100">
						<span className="text-gray-600">Tour:</span>
						<span className="font-medium">{tourInfo.name}</span>
					</div>
					<div className="flex justify-between items-center pb-2 border-b border-gray-100">
						<span className="text-gray-600">Date & Time:</span>
						<span className="font-medium">
							{bookingData.date} at {bookingData.timeSlot}
						</span>
					</div>
					<div className="flex justify-between items-center pb-2 border-b border-gray-100">
						<span className="text-gray-600">Experience Type:</span>
						<span className="font-medium capitalize">{bookingData.groupType}</span>
					</div>
					<div className="flex justify-between items-center pb-2 border-b border-gray-100">
						<span className="text-gray-600">Participants:</span>
						<span className="font-medium">
							{bookingData.participants} {bookingData.participants === 1 ? "person" : "people"}
						</span>
					</div>
					<div className="flex justify-between items-center pb-2 border-b border-gray-100">
						<span className="text-gray-600">Price per person:</span>
						<span className="font-medium">${bookingData.groupType === "solo" ? pricing.solo : pricing.group}</span>
					</div>
					<div className="pt-2 flex justify-between items-center text-lg font-bold">
						<span>Total Amount:</span>
						<span className="text-blue-600">${calculateTotal()}</span>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
				<h4 className="font-semibold text-gray-900 mb-4 flex items-center">
					<CreditCard className="w-4 h-4 text-blue-600 mr-2" />
					Payment Information
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
						<div className="relative">
							<input
								type="text"
								className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								placeholder="1234 5678 9012 3456"
							/>
							<CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							placeholder="MM/YY"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
						<input
							type="text"
							className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							placeholder="123"
						/>
					</div>
				</div>
			</div>

			<div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center">
				<Shield className="w-5 h-5 text-green-600 mr-3" />
				<p className="text-sm text-gray-600">
					Your payment information is secure and encrypted. We never store your full card details.
				</p>
			</div>

			<div className="flex justify-between pt-4">
				<button
					onClick={handlePreviousStep}
					className="border border-gray-300 bg-white text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
				>
					Back
				</button>
				<button className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center">
					Complete Booking - ${calculateTotal()}
					<CheckCircle className="w-4 h-4 ml-2" />
				</button>
			</div>
		</div>
	)

	const TourHighlights = () => (
		<div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
			<h4 className="font-semibold text-gray-900 mb-4 flex items-center">
				<Star className="w-4 h-4 text-yellow-500 mr-2" />
				Tour Highlights
			</h4>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
					<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
						<Camera className="w-5 h-5 text-blue-600" />
					</div>
					<h5 className="font-medium text-gray-900 mb-1 text-center">Iconic Landmarks</h5>
					<p className="text-xs text-gray-600 text-center">Visit the most famous historical sites</p>
				</div>
				<div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
					<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
						<Coffee className="w-5 h-5 text-green-600" />
					</div>
					<h5 className="font-medium text-gray-900 mb-1 text-center">Local Experience</h5>
					<p className="text-xs text-gray-600 text-center">Discover hidden gems and local favorites</p>
				</div>
				<div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
					<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
						<Compass className="w-5 h-5 text-purple-600" />
					</div>
					<h5 className="font-medium text-gray-900 mb-1 text-center">Expert Navigation</h5>
					<p className="text-xs text-gray-600 text-center">Guided by local history experts</p>
				</div>
			</div>
		</div>
	)

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-5xl mx-auto px-4">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Tour Experience</h1>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Follow the simple steps below to secure your spot on our highly-rated historic city walking tour
					</p>
				</div>

				<StepIndicator />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all hover:shadow-lg">
							{currentStep === 1 && <Step1GroupSelection />}
							{currentStep === 2 && <Step2DateTime />}
							{currentStep === 3 && <Step3ContactInfo />}
							{currentStep === 4 && <Step4Payment />}
						</div>
					</div>

					<div className="lg:col-span-1">
						<TourOverview />

						{currentStep < 4 && <TourHighlights />}

						{bookingData.groupType && (
							<div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all hover:shadow-lg">
								<h4 className="font-semibold text-gray-900 mb-4 flex items-center">
									<CreditCard className="w-4 h-4 text-blue-600 mr-2" />
									Price Breakdown
								</h4>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between items-center pb-2 border-b border-gray-100">
										<span className="text-gray-600">
											{bookingData.participants} × ${bookingData.groupType === "solo" ? pricing.solo : pricing.group}
										</span>
										<span className="font-medium">${calculateTotal()}</span>
									</div>
									{bookingData.groupType === "group" && (
										<div className="bg-green-50 text-green-700 text-xs font-medium p-2 rounded-lg flex items-center">
											<CheckCircle className="w-3 h-3 mr-1" />
											You save ${(pricing.solo - pricing.group) * bookingData.participants} with group pricing!
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default TourBookingInterface
