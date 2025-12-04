# Etapa 1: build (compila TypeScript)
FROM node:20-alpine AS build

WORKDIR /app

# Copia apenas arquivos de dependências primeiro (cache mais eficiente)
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY tsconfig.json ./
COPY src ./src

# Compila o projeto
RUN npm run build

# Etapa 2: runtime (imagem final, só com o necessário)
FROM node:20-alpine AS runtime

WORKDIR /app

# Copia package.json pra manter metadados e dependências
COPY package*.json ./

# Instala só dependências de produção
RUN npm install --omit=dev

# Copia os arquivos compilados da etapa de build
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
