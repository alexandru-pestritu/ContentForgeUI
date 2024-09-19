FROM node:18-alpine as build

WORKDIR /app/src

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build -- --configuration production

FROM node:18-alpine

WORKDIR /usr/app

COPY --from=build /app/src/dist/content-forge-ui ./

COPY entrypoint.sh /usr/app/entrypoint.sh
RUN chmod +x /usr/app/entrypoint.sh

ENV API_URL=http://your-production-api-url.com/api/v1

ENTRYPOINT ["/usr/app/entrypoint.sh"]

EXPOSE 4200