import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000",
});

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:5000",
});

axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("greddiit-access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);
