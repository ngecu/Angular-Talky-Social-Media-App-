import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 1000,
  duration: "10s",
  thresholds: {
    http_req_failed: ["rate < 0.1"],
  },
};

export default function () {
  const body = JSON.stringify({
    email: "phillipwaiganjo@gmail.com",
    fullname: "Phillip Waiganjo",
    username: "PhillipWaiganjo123",
    password: "12345678",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  http.post("http://localhost:4500/user/register", body, params);
  sleep(1); //delay of one second
}

