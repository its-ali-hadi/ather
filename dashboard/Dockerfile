FROM node:24.11.0-slim

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Increase timeout for slow connections
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-timeout 600000 \
    && npm install

# Copy the rest of the dashboard code
COPY . .

EXPOSE 5173

# Run vite in host mode so it's accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]
