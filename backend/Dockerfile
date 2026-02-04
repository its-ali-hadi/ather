FROM node:24.11.0-slim

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Increase timeout for slow connections
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-timeout 600000 \
    && npm install

# Copy the rest of the application
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "start"]
