FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

ENV PORT=3002
EXPOSE 3002

CMD ["node", "dist/index.js"]
