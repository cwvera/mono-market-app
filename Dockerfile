# syntax=docker/dockerfile:1

# ---- build ----
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ---- runtime ----
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist/mono-market-app/browser /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
