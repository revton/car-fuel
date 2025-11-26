FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
# Tenta usar npm ci (lockfile em dia); se falhar por lock desatualizado,
# faz npm install para manter o build funcional em novos clones.
RUN npm ci || npm install

COPY . .

ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
