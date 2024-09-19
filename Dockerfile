FROM node:18-alpine as build

WORKDIR /app/src

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/app

COPY --from=build /app/src/dist/content-forge-ui ./

CMD node server/server.mjs

EXPOSE 4200