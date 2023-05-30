import axios from "axios";

export const apiInstance = axios.create({
  baseURL: "http://localhost:5001/",
  headers: { Authorization: localStorage.getItem("access_token") },
  // headers: {
  //     Authorization:
  //         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ndXllbm1pbmhAZ21haWwuY29tIiwiaWF0IjoxNjg0NjM0NjM3fQ.cweDebzdi2BPlJ9whQhI3L0liyod_qBml4nfIL_MM_A",
  // },
});
