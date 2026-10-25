FROM node:22-alpine AS frontend
WORKDIR /fe
COPY Assignment/eComFrontend/package.json Assignment/eComFrontend/package-lock.json ./
RUN npm ci
COPY Assignment/eComFrontend/ ./
ENV VITE_API_URL=
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY Assignment/eComBackend/package.json Assignment/eComBackend/package-lock.json ./
RUN npm ci --omit=dev
COPY Assignment/eComBackend/ ./
COPY --from=frontend /fe/dist /eComFrontend/dist
ENV NODE_ENV=production
ENV PORT=4380
EXPOSE 4380
CMD ["node", "server.js"]
