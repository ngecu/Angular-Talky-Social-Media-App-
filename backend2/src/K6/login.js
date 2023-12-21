import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 100,
  duration: "10s",
};

// export default function () {
//   const body = JSON.stringify({
//     email: "9superbikes@gmail.com",
//     password: "12345678",
//   });
//   const params = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   http.post("http://localhost:4500/user/login", body, params);
//   sleep(1); //delay of one second
// }

//has assertions
export default function () {
  const body = JSON.stringify({
    email: "phillipwaiganjo@gmail.com",
    password: "12345678",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = http.post("http://localhost:4500/user/login", body, params);
  check(response, {
    "is status 200?": (res) => res.status == 200,
    // "is successfully logged in?": res => console.log(res.body),
    "is successfully logged in?": (res) =>
      res.body.includes("Logged in successfully"),
  });
  sleep(1); //delay of one second
}
