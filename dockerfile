FROM node:23-slim AS runtime

WORKDIR /

COPY server/package*.json ./server/
COPY server/dist ./server/dist
COPY client/build ./client/build

WORKDIR /server
RUN npm ci --omit=dev

EXPOSE 80

CMD ["node", "dist/server.js"]