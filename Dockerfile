FROM node:18-alpine as build

WORKDIR /app/src

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build -- --configuration production

FROM node:18-alpine

WORKDIR /usr/app

COPY --from=build /app/src/dist/content-forge-ui ./
COPY entrypoint.sh /usr/app/
RUN chmod +x /usr/app/entrypoint.sh

ENTRYPOINT ["/usr/app/entrypoint.sh"]
CMD ["node", "server/server.mjs"]

EXPOSE 4200
