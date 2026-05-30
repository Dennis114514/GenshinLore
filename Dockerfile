FROM node:22-alpine

WORKDIR /app

COPY mcp-server/package*.json ./mcp-server/
RUN npm ci --prefix ./mcp-server --omit=dev

COPY . .

ENV NODE_ENV=production

WORKDIR /app/mcp-server

EXPOSE 3000

CMD ["npm", "start"]
