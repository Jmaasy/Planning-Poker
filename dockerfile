FROM node:23-slim AS runtime

WORKDIR /

COPY server/package*.json ./server/
COPY server/dist ./server/dist
COPY client/dist ./client/dist

WORKDIR /server
RUN npm ci --omit=dev

EXPOSE 443

CMD ["node", "dist/server.js"]