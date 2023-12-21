import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 1000,
  duration: "10s",
    thresholds: {
      http_req_failed: ['rate < 0.1']
  },
};

export default function () {
     const params = {
       headers: {
         "Content-Type": "application/json",
         token:
           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJkZGNlMTQyYy1hNTJlLTQ0ZTktOWRiYy1kYzQ0YjE5ODc3ZTgiLCJlbWFpbCI6ImdhbWVteTE3N0BnbWFpbC5jb20iLCJmdWxsbmFtZSI6IkRhbmllbCBLaXRoZWthIiwidXNlcm5hbWUiOiJEYW5pZWxLaXRoZWthMTIzIiwicm9sZSI6InVzZXIiLCJwcm9maWxlVXJsIjoiaHR0cHM6Ly9jZG4ucGl4YWJheS5jb20vcGhvdG8vMjAyMy8xMS8yMS8wMC8xMy9haS1nZW5lcmF0ZWQtODQwMjEyOV82NDAucG5nIiwicHJvZmlsZUNhcHRpb24iOiJObyBDYXB0aW9uIiwiaXNXZWxjb21lZCI6dHJ1ZSwiaXNEZWxldGVkIjpmYWxzZSwicmVzZXRQYXNzd29yZCI6ZmFsc2UsInJlc2V0VG9rZW4iOm51bGwsImV4cGlyeVRpbWUiOm51bGwsIk9UUCI6bnVsbCwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTZUMTA6NTI6NDUuMDY3WiIsImlhdCI6MTcwMzEwNDI3MCwiZXhwIjoxNzAzMTkwNjcwfQ.PUMfZVCzrtAaum3d3Jv1s6uSTr1l0lRCJeOSRr-tf8c",
       },
     };
    http.get("http://localhost:4500/user/getallusers", params);
}
