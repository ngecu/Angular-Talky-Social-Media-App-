import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 300,
  duration: "10s",
};

export default function () {
  const body = JSON.stringify({
    comment:
      "There's something soothing about the sound of raindrops falling on an umbrella.",
    postID: "aac94e1e-fcb4-48c7-8add-243bda111a40",
    userID: "33f9de61-d6b8-4d61-b1f4-b8fec2e4052f",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  http.post("http://localhost:4500/post/createcomment", body, params);
  sleep(1); //delay of one second
}

