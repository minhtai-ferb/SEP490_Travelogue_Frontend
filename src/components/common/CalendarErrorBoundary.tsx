import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle } from 'lucide-react'

interface CalendarErrorBoundaryProps {
	children: React.ReactNode
	error?: string | null
	loading?: boolean
	onRetry?: () => void
}

export const CalendarErrorBoundary: React.FC<CalendarErrorBoundaryProps> = ({
	children,
	error,
	loading,
	onRetry
}) => {
	if (loading) {
		return (
			<Card className="border-0 shadow-none">
				<CardContent className="p-8 flex items-center justify-center">
					<div className="flex items-center space-x-2">
						<RefreshCw className="h-4 w-4 animate-spin" />
						<span>Đang tải lịch trình...</span>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return (
			<Card className="border-0 shadow-none">
				<CardContent className="p-8">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription className="ml-2">
							{error}
						</AlertDescription>
					</Alert>
					{onRetry && (
						<Button
							variant="outline"
							onClick={onRetry}
							className="mt-4"
							size="sm"
						>
							<RefreshCw className="h-4 w-4 mr-2" />
							Thử lại
						</Button>
					)}
				</CardContent>
			</Card>
		)
	}

	return <>{children}</>
}
