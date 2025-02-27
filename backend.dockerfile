FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json, yarn.lock and tsconfig.json to the working directory
COPY package.json yarn.lock tsconfig.json ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the working directory
COPY src ./src

# Build the TypeScript code
RUN yarn run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]