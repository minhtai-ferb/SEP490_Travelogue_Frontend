import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { HistoricalSite } from '@/types/History';
import { Location } from '@/types/Location';

// Main atom that stores the favorites with persistence
export const favoritesAtom = atomWithStorage<Location[]>('favoriteLocations', []);

// Derived atom to check if a location is in favorites
export const isFavoriteAtom = atom(
	(get) => (locationId: string) => {
		const favorites = get(favoritesAtom);
		return favorites.some(location => location.id === locationId);
	}
);

// Actions to manage favorites
export const toggleFavoriteAtom = atom(
	null,
	(get, set, location: Location) => {
		const favorites = get(favoritesAtom);
		const isFavorite = favorites.some(item => item.id === location.id);

		if (isFavorite) {
			// Remove from favorites
			set(favoritesAtom, favorites.filter(item => item.id !== location.id));
		} else {
			// Add to favorites
			set(favoritesAtom, [...favorites, location]);
		}
	}
);
