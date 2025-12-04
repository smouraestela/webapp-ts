import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
