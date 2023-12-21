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
    http_req_duration: ["p(90)<300"],
  },
};

export default function () {
  const body = JSON.stringify({
    following_userID: "33f9de61-d6b8-4d61-b1f4-b8fec2e4052f",
    followed_userID: "04947279-d765-4eac-b6f6-96beed409ba9",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    //   token:
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJkZGNlMTQyYy1hNTJlLTQ0ZTktOWRiYy1kYzQ0YjE5ODc3ZTgiLCJlbWFpbCI6ImdhbWVteTE3N0BnbWFpbC5jb20iLCJmdWxsbmFtZSI6IkRhbmllbCBLaXRoZWthIiwidXNlcm5hbWUiOiJEYW5pZWxLaXRoZWthMTIzIiwicm9sZSI6InVzZXIiLCJwcm9maWxlVXJsIjoiaHR0cHM6Ly9jZG4ucGl4YWJheS5jb20vcGhvdG8vMjAyMy8xMS8yMS8wMC8xMy9haS1nZW5lcmF0ZWQtODQwMjEyOV82NDAucG5nIiwicHJvZmlsZUNhcHRpb24iOiJObyBDYXB0aW9uIiwiaXNXZWxjb21lZCI6dHJ1ZSwiaXNEZWxldGVkIjpmYWxzZSwicmVzZXRQYXNzd29yZCI6ZmFsc2UsInJlc2V0VG9rZW4iOm51bGwsImV4cGlyeVRpbWUiOm51bGwsIk9UUCI6bnVsbCwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTZUMTA6NTI6NDUuMDY3WiIsImlhdCI6MTcwMzEwNDI3MCwiZXhwIjoxNzAzMTkwNjcwfQ.PUMfZVCzrtAaum3d3Jv1s6uSTr1l0lRCJeOSRr-tf8c",
    },
  };

  http.post("http://localhost:4500/user/toggleFollowUser", body, params);
  sleep(1); //delay of one second
}
