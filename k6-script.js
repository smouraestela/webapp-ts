import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,              // 5 usuários virtuais
  duration: '30s',     // teste de 30 segundos
};

export default function () {
  const res = http.get('http://localhost:3000/api/users');

  check(res, {
    'status é 200': (r) => r.status === 200,
    'resposta em menos de 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // espera 1s antes da próxima iteração
}
