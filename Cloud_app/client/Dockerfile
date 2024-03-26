FROM node:20-alpine AS builder
WORKDIR /app
# Copy package.json and install packages
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000
CMD ["npm", "start"]