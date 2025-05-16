"use client"

import { useState, useEffect, useRef } from "react"

interface UseVietmapOptions {
	apiKey: string
	autoLoad?: boolean
}

interface UseVietmapReturn {
	isLoaded: boolean
	loadScripts: () => Promise<void>
	vietmapgl: any
	error: Error | null
}

export function useVietmap({ apiKey, autoLoad = true }: UseVietmapOptions): UseVietmapReturn {
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const vietmapglRef = useRef<any>(null)

	const loadScripts = async (): Promise<void> => {
		if (typeof window === "undefined") {
			setError(new Error("Window is not defined"))
			return
		}

		// Return early if already loaded
		if (window.vietmapgl) {
			vietmapglRef.current = window.vietmapgl
			setIsLoaded(true)
			return
		}

		try {
			// Load CSS
			const linkEl = document.createElement("link")
			linkEl.rel = "stylesheet"
			linkEl.href = "https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.css"
			document.head.appendChild(linkEl)

			// Load JS
			const scriptEl = document.createElement("script")
			scriptEl.src = "https://unpkg.com/@vietmap/vietmap-gl-js@4.2.0/vietmap-gl.js"
			scriptEl.async = true

			// Create a promise to wait for script load
			await new Promise<void>((resolve, reject) => {
				scriptEl.onload = () => {
					vietmapglRef.current = window.vietmapgl
					setIsLoaded(true)
					resolve()
				}

				scriptEl.onerror = () => {
					setError(new Error("Failed to load Vietmap GL JS"))
					reject(new Error("Failed to load Vietmap GL JS"))
				}

				document.body.appendChild(scriptEl)
			})
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Unknown error loading Vietmap GL JS"))
		}
	}

	useEffect(() => {
		if (autoLoad) {
			loadScripts()
		}

		return () => {
			// No cleanup needed for script loading
		}
	}, [autoLoad])

	return {
		isLoaded,
		loadScripts,
		vietmapgl: vietmapglRef.current,
		error,
	}
}

