import { GET } from "@/services/newsService";

export const TOUR_API_URL = {
  ALL_TOURS: "tour",
  TOUR_ASSIGNED: "/tour/guide/email",
  TOUR_ASSIGNED_SEARCH: "/tourguides/search",
  TOUR_ASSIGNED_BY_ID: "/tourguides/assigned/",
  TOURGUIDE_PROFILE: "/tour-guide/:id",
  TOUR_UPDATE_SCHEDULE: "/tour/tour-schedule/",
};

export const LOCATION_API_URL = {
  LOCATION_TYPES: "location/location-type",
  LOCATION_SEARCH: "location/filter-paged",
};

export const TOUR_GUIDE_API_URL = {
  TOUR_GUIDE: "/tour-guide",
  TOUR_GUIDE_PROFILE: "/tour-guide/:id",
  GET_TOUR_GUIDE_SCHEDULE_DETAIL: "/tour-guide/schedules/:id",
  TOUR_GUIDE_SCHEDULE: "/tour-guide/schedules",
  TOUR_GUIDE_CERTIFICATION: "/tour-guide/certification",
  CREATE_TOUR_GUIDE_REQUEST: "/user/tour-guide-request",
  GET_TOUR_GUIDE_REQUEST_LATEST: "/user/latest-tour-guide-request",
  CREATE_REJECTION_REQUEST: "rejection-request",
  TOUR_GUIDE_REJECTION_REQUEST_FILTER: "rejection-request/page",
  TOUR_GUIDE_REJECTION_REQUEST_DETAIL: "rejection-request/:id",
  TOUR_GUIDE_REJECTION_REQUEST_APPROVE: "rejection-request/:requestId/approve",
  TOUR_GUIDE_REJECTION_REQUEST_REJECT: "rejection-request/:requestId/reject",
};

export const MEDIA_API_URL = {
  UPLOAD_MULTIPLE_CERTIFICATIONS: "/media/upload-multiple-certifications",
  DELETE_CERTIFICATION: "/media/certification/{fileName}",
};

export const USER_API_URL = {
  GET_USER_REQUEST: "/user/tour-guide-request",
  REQUEST_REVIEW: "/user/:requestId/review",
};

export const CRAFT_VILLAGE_API_URL = {
  GET_CRAFT_VILLAGE_REQUEST: "user/craft-village-request",
  CREATE_CRAFT_VILLAGE_REQUEST: "user/craft-village-request",
  CRAFT_VILLAGE_REQUEST_BY_ID: "user/craft-village-request/:id",
  UPDATE_CRAFT_VILLAGE_REQUEST: "user/craft-village-request/:id/review",
  LASTEST_CRAFT_VILLAGE_REQUEST: "user/latest-craft-village-request/",
};

export const WALLET_API_URL = {
  GET_WALLET_BALANCE: "wallet/balance",
  GET_WALLET: "wallet",
  GET_WALLET_TRANSACTIONS: "wallet/transactions",
  WITHDRAWAL_REQUEST: "wallet/withdrawal-request",
  MY_WITHDRAWAL_REQUESTS: "wallet/my-withdrawal-requests/filter",
  WITHDRAWAL_REQUESTS_FILTER: "wallet/withdrawal-requests/filter",
  APPROVE_WITHDRAWAL_REQUEST: "wallet/withdrawal-requests/:requestId/approve",
  REJECT_WITHDRAWAL_REQUEST: "wallet/withdrawal-requests/:requestId/reject",
};

export const BANK_ACCOUNT_API_URL = {
  GET_BANK_ACCOUNT: "bank-account",
  CREATE_BANK_ACCOUNT: "bank-account",
  UPDATE_BANK_ACCOUNT: "bank-account/:id",
  DELETE_BANK_ACCOUNT: "bank-account/:id",
};

export const WORKSHOP_API_URL = {
  WORKSHOP: "workshop",
  WORKSHOP_BULK: "workshop/bulk",
  WORKSHOP_DETAIL: "workshop/:id",
  WORKSHOP_SCHEDULES: "workshop/:id/schedules",
  WORKSHOP_UPDATE: "workshop/:id",
  WORKSHOP_UPDATE_SCHEDULE: "workshop/update-schedule/:scheduleId",
  WORKSHOP_DELETE_SCHEDULE: "workshop/:scheduleId",
  WORKSHOP_SUBMIT: "workshop/submit/:id",
  WORKSHOP_MODERATOR_FILTER: "workshop/moderator-filter",
};

export const REFUND_API_URL = {
  GET_REFUND_REQUESTS: "refund-request/admin",
  GET_REFUND_REQUEST_BY_ID: "refund-request/:refundRequestId",
  APPROVE_REFUND_REQUEST: "refund-request/:refundRequestId/approve",
  REJECT_REFUND_REQUEST: "refund-request/:refundRequestId/reject",
};


export const REPORT_API_URL = {
  GET_REPORT: "report/page",
  GET_MY_REPORTS: "report/my-reports",
  GET_REPORT_BY_ID: "report/by-review/:reportId",
  GET_REPORT_BY_STATUS: "report/by-status",
  ADMIN_PROCESS_REPORT: "report/:reportId/process",
}