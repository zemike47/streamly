FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]