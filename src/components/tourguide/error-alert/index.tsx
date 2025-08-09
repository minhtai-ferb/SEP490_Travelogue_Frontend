"use client"

import React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorAlertProps {
	message: string
	onRetry: () => void
}

export const ErrorAlert = React.memo<ErrorAlertProps>(({ message, onRetry }) => {
	return (
		<Alert variant="destructive" className="mb-6">
			<AlertCircle className="h-4 w-4" />
			<AlertDescription className="flex items-center justify-between">
				<span>{message}</span>
				<Button variant="outline" size="sm" onClick={onRetry} className="ml-4 bg-transparent">
					<RefreshCw className="w-4 h-4 mr-2" />
					Thử lại
				</Button>
			</AlertDescription>
		</Alert>
	)
})

ErrorAlert.displayName = "ErrorAlert"
