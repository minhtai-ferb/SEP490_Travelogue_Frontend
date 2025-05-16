import axios from "axios";
import Cookies from "js-cookie";

// Create a custom Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Set your API base URL
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add an authentication token to every request

    let token;

    if (typeof window !== "undefined") {
      token = Cookies.get("jwtToken"); // Get the token from cookies
      // Client-side code
      console.log("Client side cookies: ", token);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

	// Set 'Content-Type': 'application/json' if the request is not FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosInstance;
