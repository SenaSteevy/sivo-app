# Stage 1: Build the Angular app
FROM node:16 AS build
WORKDIR /app
COPY . .

# Install dependencies and build the app
RUN npm install
RUN npm run build --prod

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom nginx.conf (if needed for routing and other configurations)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy env.js to assets folder in Nginx
COPY src/assets/env.js /usr/share/nginx/html/assets/env.js

CMD ["/bin/sh", "-c", "echo 'API_GATEWAY_URL: $API_GATEWAY_URL' && envsubst '$API_GATEWAY_URL' < /usr/share/nginx/html/assets/env.js > /usr/share/nginx/html/assets/env.tmp.js && mv /usr/share/nginx/html/assets/env.tmp.js /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
