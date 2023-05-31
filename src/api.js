import axios from "axios";

export const apiInstance = axios.create({
  baseURL: "http://localhost:5001/",
  headers: { Authorization: localStorage.getItem("access_token") },
});
