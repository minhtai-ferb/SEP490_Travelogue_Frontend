import { NextResponse } from "next/server"

// This would be replaced with a real database or CMS in production
const newsData = [
	{
		id: 1,
		title: "District's New Park Project Breaks Ground",
		description:
			"The long-awaited central park project has officially begun construction, promising new recreational spaces for residents.",
		category: "LOCAL",
		image: "/placeholder.svg?height=600&width=1200",
		date: "2023-04-03",
		featured: true,
		premium: false,
	},
	{
		id: 2,
		title: "Local Farmers Market Expands to Twice Weekly",
		description:
			"Due to popular demand, the district's farmers market will now operate on both Wednesdays and Saturdays.",
		category: "LOCAL",
		image: "/placeholder.svg?height=400&width=600",
		date: "2023-04-02",
		featured: false,
		premium: false,
	},
	{
		id: 3,
		title: "Community Clean-up Initiative Sees Record Participation",
		description: "Over 500 volunteers joined the district's annual clean-up day, removing over two tons of litter.",
		category: "COMMUNITY",
		image: "/placeholder.svg?height=400&width=600",
		date: "2023-04-02",
		featured: false,
		premium: true,
	},
	{
		id: 4,
		title: "District Schools Implement New STEM Curriculum",
		description: "Local schools are rolling out an enhanced science and technology program starting next semester.",
		category: "EDUCATION",
		image: "/placeholder.svg?height=400&width=600",
		date: "2023-04-01",
		featured: false,
		premium: false,
	},
	{
		id: 5,
		title: "New Tech Startup Hub Opens Downtown",
		description: "A renovated warehouse now hosts 20 startup companies in our growing technology sector.",
		category: "BUSINESS",
		image: "/placeholder.svg?height=400&width=600",
		date: "2023-04-01",
		featured: false,
		premium: true,
	},
	{
		id: 6,
		title: "Annual District Festival Returns This Weekend",
		description: "The popular district festival will feature local food, music, and activities for all ages.",
		category: "EVENTS",
		image: "/placeholder.svg?height=120&width=120",
		date: "2023-04-03",
		featured: false,
		premium: false,
	},
	{
		id: 7,
		title: "New Traffic Pattern to Ease Downtown Congestion",
		description: "Changes to downtown traffic flow aim to reduce congestion during peak hours.",
		category: "INFRASTRUCTURE",
		image: "/placeholder.svg?height=120&width=120",
		date: "2023-04-03",
		featured: false,
		premium: false,
	},
	{
		id: 8,
		title: "Local Hospital Expands Emergency Services",
		description: "The district hospital has completed a major expansion of its emergency department.",
		category: "HEALTH",
		image: "/placeholder.svg?height=120&width=120",
		date: "2023-04-02",
		featured: false,
		premium: false,
	},
	{
		id: 9,
		title: "District High School Wins Regional Championship",
		description: "The local high school basketball team secured the regional title for the first time in a decade.",
		category: "SPORTS",
		image: "/placeholder.svg?height=120&width=120",
		date: "2023-04-02",
		featured: false,
		premium: false,
	},
]

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const category = searchParams.get("category")
	const featured = searchParams.get("featured")
	const premium = searchParams.get("premium")

	let filteredNews = [...newsData]

	if (category) {
		filteredNews = filteredNews.filter((item) => item.category.toLowerCase() === category.toLowerCase())
	}

	if (featured === "true") {
		filteredNews = filteredNews.filter((item) => item.featured)
	}

	if (premium === "true") {
		filteredNews = filteredNews.filter((item) => item.premium)
	}

	// Sort by date (newest first)
	filteredNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	return NextResponse.json(filteredNews)
}





