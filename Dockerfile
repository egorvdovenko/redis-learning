FROM node:12-alpine
RUN npm install -g nodemon
WORKDIR /app
COPY . .
RUN npm ci
CMD ["nodemon", "src/server.js"]