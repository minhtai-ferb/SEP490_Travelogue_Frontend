import React from "react"
import { Card, CardContent } from "@/components/ui/card"

export const LoadingSkeleton = React.memo(() => {
	return (
		<div className="space-y-4">
			{[...Array(3)].map((_, index) => (
				<Card key={index} className="animate-pulse">
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row md:items-center justify-between">
							<div className="flex-1">
								<div className="flex items-center space-x-3 mb-2">
									<div className="h-6 bg-gray-200 rounded w-64"></div>
									<div className="h-6 bg-gray-200 rounded w-20"></div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="h-4 bg-gray-200 rounded w-48"></div>
									<div className="h-4 bg-gray-200 rounded w-32"></div>
									<div className="h-4 bg-gray-200 rounded w-24"></div>
									<div className="h-4 bg-gray-200 rounded w-20"></div>
								</div>
							</div>
							<div className="mt-4 md:mt-0 md:ml-6">
								<div className="h-10 bg-gray-200 rounded w-24"></div>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
})

LoadingSkeleton.displayName = "LoadingSkeleton"
