"use client";

import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    let token;

    if (typeof window !== "undefined") {
      token = Cookies.get("jwtToken"); // Get the token from cookies
      // Client-side code
      console.log("Client side cookies: ", token);
    }

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Set 'Content-Type': 'application/json' if the request is not FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
      console.log("Setting Content-Type to multipart/form-data");
    } else {
      config.headers["Content-Type"] = "application/json";
    }


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;

// import axios from "axios";
// import { refreshAuthToken } from "../utils/authUtils";

// const SERVER = import.meta.env.VITE_API_URL_SERVER;
// const LOCAL = import.meta.env.VITE_API_URL_LOCAL;

// const api = axios.create({
//   baseURL: LOCAL,
// });

// api.interceptors.request.use(
//   function (config) {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Prevent infinite retry loop

//       try {
//         const newToken = await refreshAuthToken();
//         axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
