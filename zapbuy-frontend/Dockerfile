# Stage 1: Build Angular app
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install -g @angular/cli@16.1.0 && npm install

# Copy all files
COPY . .

# Build without progress
RUN ng build 

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/zapbuy-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
