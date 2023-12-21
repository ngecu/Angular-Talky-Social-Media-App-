import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 100,
  duration: "10s",
};

export default function () {
  const body = JSON.stringify({
    parentCommentID: "700af1a8-46e2-4189-b5a6-a560bf03e81c",
    comment:
      "Raindrops on the umbrella, nature's lullaby, soothing, calming, comforting embrace.",
    postID: "aac94e1e-fcb4-48c7-8add-243bda111a40",
    userID: "33f9de61-d6b8-4d61-b1f4-b8fec2e4052f",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    //   token:
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJkZGNlMTQyYy1hNTJlLTQ0ZTktOWRiYy1kYzQ0YjE5ODc3ZTgiLCJlbWFpbCI6ImdhbWVteTE3N0BnbWFpbC5jb20iLCJmdWxsbmFtZSI6IkRhbmllbCBLaXRoZWthIiwidXNlcm5hbWUiOiJEYW5pZWxLaXRoZWthMTIzIiwicm9sZSI6InVzZXIiLCJwcm9maWxlVXJsIjoiaHR0cHM6Ly9jZG4ucGl4YWJheS5jb20vcGhvdG8vMjAyMy8xMS8yMS8wMC8xMy9haS1nZW5lcmF0ZWQtODQwMjEyOV82NDAucG5nIiwicHJvZmlsZUNhcHRpb24iOiJObyBDYXB0aW9uIiwiaXNXZWxjb21lZCI6dHJ1ZSwiaXNEZWxldGVkIjpmYWxzZSwicmVzZXRQYXNzd29yZCI6ZmFsc2UsInJlc2V0VG9rZW4iOm51bGwsImV4cGlyeVRpbWUiOm51bGwsIk9UUCI6bnVsbCwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTZUMTA6NTI6NDUuMDY3WiIsImlhdCI6MTcwMzEwNDI3MCwiZXhwIjoxNzAzMTkwNjcwfQ.PUMfZVCzrtAaum3d3Jv1s6uSTr1l0lRCJeOSRr-tf8c",
    },
  };

  http.post("http://localhost:4500/post/replycomment", body, params);
  sleep(1); //delay of one second
}
