FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

RUN chown -R node:node /app
USER node

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the node.js dependencies
RUN npm ci

# Copy the rest of the application files to the container
COPY . .

RUN npm run build

# Run the specified command
ENTRYPOINT ["/bin/sh", "-c", "npm run watch:start"]
