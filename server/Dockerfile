FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV PORT=3002
EXPOSE 3002

CMD ["npx", "ts-node", "index.ts"]
