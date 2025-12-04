import express, { Request, Response, NextFunction } from "express";
import client from "prom-client";

const app = express();
const PORT = process.env.PORT || 3000;

// Registro padrão
const register = new client.Registry();

// Coletar métricas padrão de processo (CPU, memória, etc.)
client.collectDefaultMetrics({
  register,
});

// Exemplo: histograma de duração de requisições HTTP
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duração das requisições HTTP em segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.3, 1, 3, 5],
});

register.registerMetric(httpRequestDuration);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;

    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, String(res.statusCode))
      .observe(durationInSeconds);
  });

  next();
});

// Rota simples HTML
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <title>Mini Web App em TypeScript</title>
      </head>
      <body>
        <h1>Bem-vinda ao mini web app em TS 👋</h1>
        <p>Tente chamar <code>/api/users</code> para ver um JSON.</p>
      </body>
    </html>
  `);
});

// Rota de API para você testar automação / k6 / etc
app.get("/api/users", (req: Request, res: Response) => {
  res.json([
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "user" },
    { id: 3, name: "Carol", role: "user" }
  ]);
});

// Endpoint de POST só pra brincar com payload
app.post("/api/users", (req: Request, res: Response) => {
  const user = req.body;
  // Aqui você poderia validar, salvar em DB, etc.
  return res.status(201).json({
    message: "Usuário criado (fake)",
    user
  });
});

app.get("/metrics", async (_req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
