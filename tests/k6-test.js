import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 100 },
    { duration: "40s", target: 100 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const res = http.get("http://127.0.0.1:65429/");

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}