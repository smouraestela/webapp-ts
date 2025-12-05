import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,              // 5 usuários virtuais
  duration: '30s',     // teste de 30 segundos
  thresholds: {
    // 95% das requisições com p(95) < 200ms
    http_req_duration: ['p(95)<200'],
    // menos de 1% das requisições podem falhar
    http_req_failed: ['rate<0.01'],
    // opcional: todas as checks com 100% de sucesso
    checks: ['rate>0.99'],
  }

};

export default function () {
  const res = http.get('http://localhost:3000/api/users');

  check(res, {
    'status é 200': (r) => r.status === 200,
    'resposta em menos de 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // espera 1s antes da próxima iteração
}
