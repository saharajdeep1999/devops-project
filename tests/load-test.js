import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const createLatency = new Trend('create_latency', true);
const readLatency   = new Trend('read_latency', true);
const errorRate     = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '10s', target: 500 },
    { duration: '30s', target: 500 },
    { duration: '10s', target: 0   },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    error_rate:        ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  const createRes = http.post(
    `${BASE_URL}/items`,
    JSON.stringify({ name: `item-${__VU}-${__ITER}`, description: 'load test item' }),
    { headers }
  );
  createLatency.add(createRes.timings.duration);
  check(createRes, { 'create status 201': (r) => r.status === 201 });
  errorRate.add(createRes.status >= 400);

  const readRes = http.get(`${BASE_URL}/items`);
  readLatency.add(readRes.timings.duration);
  check(readRes, { 'read status 200': (r) => r.status === 200 });
  errorRate.add(readRes.status >= 400);

  let itemId = null;
  try { itemId = JSON.parse(createRes.body).id; } catch (_) {}
  if (itemId) {
    const readOneRes = http.get(`${BASE_URL}/items/${itemId}`);
    check(readOneRes, { 'read-one status 200': (r) => r.status === 200 });
    errorRate.add(readOneRes.status >= 400);

    const updateRes = http.put(
      `${BASE_URL}/items/${itemId}`,
      JSON.stringify({ description: 'updated by load test' }),
      { headers }
    );
    check(updateRes, { 'update status 200': (r) => r.status === 200 });
    errorRate.add(updateRes.status >= 400);

    const deleteRes = http.del(`${BASE_URL}/items/${itemId}`);
    check(deleteRes, { 'delete status 200': (r) => r.status === 200 });
    errorRate.add(deleteRes.status >= 400);
  }

  sleep(0.5);
}