FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma

RUN npm ci --only=production

COPY . .

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 8011

CMD ["node", "index.js"]