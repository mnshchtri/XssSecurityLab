# Use Node.js LTS version
FROM node:20-alpine

# Add maintainer label
LABEL maintainer="mnshchtri"

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create a health check endpoint
RUN echo 'app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));' >> server/index.ts

# Expose port 3000
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"] 