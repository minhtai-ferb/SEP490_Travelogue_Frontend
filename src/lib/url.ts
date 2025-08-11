export function toAbsoluteUrl(inputUrl?: string): string {
	const fallback = "/default_image.png";
	if (!inputUrl) return fallback;

	const url = inputUrl.trim();
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (url.startsWith("//")) return `https:${url}`;

	const base = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

	if (url.startsWith("/")) {
		return base ? `${base}${url}` : url;
	}

	// Relative path like images/foo.jpg
	return base ? `${base}/${url}` : `/${url}`;
}


