FROM node:20-alpine AS builder
WORKDIR /app
# Copy package.json and install packages
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000
CMD ["npm", "start"]
# # Copy other project files and build
# COPY . /app
# RUN npm run build

# FROM nginx:alpine
# WORKDIR /usr/local/bin
# COPY --from=builder /app/build /usr/share/nginx/html

# COPY generate-config.sh .

# # COPY public/ .
# # COPY src/ .
# # COPY package*.json .

# # RUN npm install

# CMD ["npm", "start"]