FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json frontend/

RUN npm ci --workspace=@sports-connect/frontend --include-workspace-root

COPY frontend ./frontend

ARG VITE_API_BASE_URL=/api
ARG VITE_ENABLE_ASSISTANT=true
ARG VITE_ENABLE_TICKETS_WIDGET=true
ARG VITE_ENABLE_BETTING_WIDGET=false
ARG VITE_ENABLE_AD_WIDGET=true

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ENABLE_ASSISTANT=$VITE_ENABLE_ASSISTANT
ENV VITE_ENABLE_TICKETS_WIDGET=$VITE_ENABLE_TICKETS_WIDGET
ENV VITE_ENABLE_BETTING_WIDGET=$VITE_ENABLE_BETTING_WIDGET
ENV VITE_ENABLE_AD_WIDGET=$VITE_ENABLE_AD_WIDGET

WORKDIR /app/frontend
RUN npm run build

FROM nginx:1.27-alpine

ENV BACKEND_UPSTREAM=http://127.0.0.1:4000

COPY frontend/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
