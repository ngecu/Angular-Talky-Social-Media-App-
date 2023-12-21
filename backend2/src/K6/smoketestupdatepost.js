import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 700,
  duration: "10s",
  thresholds: {
    http_req_failed: ["rate < 0.2"],
  },
};

export default function () {
  const body = JSON.stringify({
    postID: "da336a69-a734-4568-9b72-0d9f747e1a9b",
    userID: "04947279-d765-4eac-b6f6-96beed409ba9",
    postContent:
      "Wishing you all a cozy and magical Christmas filled with love and laughter! #FestiveCheers #WarmWishes",
    imageUrl:
      "https://cdn.pixabay.com/photo/2019/12/06/19/06/gifts-4678018_640.jpg",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJkZGNlMTQyYy1hNTJlLTQ0ZTktOWRiYy1kYzQ0YjE5ODc3ZTgiLCJlbWFpbCI6ImdhbWVteTE3N0BnbWFpbC5jb20iLCJmdWxsbmFtZSI6IkRhbmllbCBLaXRoZWthIiwidXNlcm5hbWUiOiJEYW5pZWxLaXRoZWthMTIzIiwicm9sZSI6InVzZXIiLCJwcm9maWxlVXJsIjoiaHR0cHM6Ly9jZG4ucGl4YWJheS5jb20vcGhvdG8vMjAyMy8xMS8yMS8wMC8xMy9haS1nZW5lcmF0ZWQtODQwMjEyOV82NDAucG5nIiwicHJvZmlsZUNhcHRpb24iOiJObyBDYXB0aW9uIiwiaXNXZWxjb21lZCI6dHJ1ZSwiaXNEZWxldGVkIjpmYWxzZSwicmVzZXRQYXNzd29yZCI6ZmFsc2UsInJlc2V0VG9rZW4iOm51bGwsImV4cGlyeVRpbWUiOm51bGwsIk9UUCI6bnVsbCwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTZUMTA6NTI6NDUuMDY3WiIsImlhdCI6MTcwMzEwNDI3MCwiZXhwIjoxNzAzMTkwNjcwfQ.PUMfZVCzrtAaum3d3Jv1s6uSTr1l0lRCJeOSRr-tf8c",
    },
  };

  http.put("http://localhost:4500/post/update", body, params);
  sleep(1); //delay of one second
}
