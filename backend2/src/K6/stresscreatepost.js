import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 200 },
    { duration: "5s", target: 2 },
    { duration: "50s", target: 500 },
    { duration: "1s", target: 2 },
  ],
  thresholds: {
    http_req_failed: ["rate < 0.2"],
    http_req_duration:['p(90)<300']
  },
};

export default function () {
  const body = JSON.stringify({
    postContent:
      "Unwrapping joy and spreading cheer - it's the most wonderful time of the year! 🎄✨ #ChristmasMagic #JoyfulMoments",
    imageUrl:
      "https://cdn.pixabay.com/photo/2019/02/04/07/36/new-year-3974099_640.jpg",
    userID: "04947279-d765-4eac-b6f6-96beed409ba9",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  http.post("http://localhost:4500/post/create", body, params);
  sleep(1); //delay of one second
}
