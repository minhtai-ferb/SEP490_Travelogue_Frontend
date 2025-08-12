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

export const CRAFT_VILLAGE_API_URL = {
	GET_CRAFT_VILLAGE_REQUEST: "user/craft-village-request",
	CREATE_CRAFT_VILLAGE_REQUEST: "user/craft-village-request",
	CRAFT_VILLAGE_REQUEST_BY_ID: "user/craft-village-request/:id",
	UPDATE_CRAFT_VILLAGE_REQUEST: "user/craft-village-request/:id/review"
}

export const WALLET_API_URL = {
	GET_WALLET_BALANCE: "wallet/balance",
	GET_WALLET: "wallet",
	GET_WALLET_TRANSACTIONS: "wallet/transactions",
	WITHDRAWAL_REQUEST: "wallet/withdrawal-request",
	WITHDRAWAL_REQUESTS_FILTER: "wallet/withdrawal-requests/filter",
	APPROVE_WITHDRAWAL_REQUEST: "wallet/withdrawal-requests/:requestId/approve",
	REJECT_WITHDRAWAL_REQUEST: "wallet/withdrawal-requests/:requestId/reject"
}


export const BANK_ACCOUNT_API_URL = {
	GET_BANK_ACCOUNT: "bank-account",
	CREATE_BANK_ACCOUNT: "bank-account",
	UPDATE_BANK_ACCOUNT: "bank-account/:id",
	DELETE_BANK_ACCOUNT: "bank-account/:id",
}