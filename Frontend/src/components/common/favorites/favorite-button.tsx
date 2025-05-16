'use client'

import { Heart } from 'lucide-react'
import { useAtom } from 'jotai'
import { isFavoriteAtom, toggleFavoriteAtom } from '@/store/favorites'
import { cn } from '@/lib/utils'
import { Location } from '@/types/Location'

interface FavoriteButtonProps {
	location: Location
	className?: string
	size?: number
}

export function FavoriteButton({ location, className, size = 24 }: FavoriteButtonProps) {
	const [isFavorite] = useAtom(isFavoriteAtom)
	const [, toggleFavorite] = useAtom(toggleFavoriteAtom)

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation()
		toggleFavorite(location)
	}

	return (
		<button
			onClick={handleToggleFavorite}
			className={cn(
				"transition-all duration-200 hover:scale-110",
				className
			)}
			aria-label={isFavorite(location.id) ? "Remove from favorites" : "Add to favorites"}
		>
			<Heart
				size={size}
				className={cn(
					"transition-colors",
					isFavorite(location.id)
						? "fill-red-500 text-red-500"
						: "text-gray-400 hover:text-red-500"
				)}
			/>
		</button>
	)
}
