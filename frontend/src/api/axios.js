import axios from "axios";

const BASE_URL = process.env.BACKEND_URL;

export default axios.create({
  base_url: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const axiosPrivate = axios.create({
  base_url: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
