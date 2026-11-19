import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(error) {
  return error.response?.data?.message || "We couldn't complete your request. Please try again.";
}

export default api;
