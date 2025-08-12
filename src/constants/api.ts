export const TOUR_API_URL = {
	ALL_TOURS: 'tour',
	TOUR_ASSIGNED: "/tour/guide/email",
	TOUR_ASSIGNED_SEARCH: "/tourguides/search",
	TOUR_ASSIGNED_BY_ID: "/tourguides/assigned/",
	TOURGUIDE_PROFILE: "/tour-guide/:id",
	TOUR_UPDATE_SCHEDULE: "/tour/tour-schedule/"
}

export const LOCATION_API_URL = {
	LOCATION_TYPES: "location/location-type",
	LOCATION_SEARCH: "location/filter-paged",
}

export const TOUR_GUIDE_API_URL = {
	TOUR_GUIDE: "/tour-guide",
	TOUR_GUIDE_PROFILE: "/tour-guide/:id",
	TOUR_GUIDE_SCHEDULE: "/tour-guide/schedules",
	TOUR_GUIDE_CERTIFICATION: "/tour-guide/certification",
}

export const MEDIA_API_URL = {
	UPLOAD_MULTIPLE_CERTIFICATIONS: "/media/upload-multiple-certifications",
}

export const USER_API_URL = {
	GET_USER_REQUEST: "/user/tour-guide-request",
	REQUEST_REVIEW: "/user/:requestId/review",
}