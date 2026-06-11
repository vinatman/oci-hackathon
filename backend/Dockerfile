FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json backend/

RUN npm ci --workspace=@sports-connect/backend --include-workspace-root

COPY backend ./backend

WORKDIR /app/backend
RUN npm run build

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run prisma:seed && node dist/server.js"]
