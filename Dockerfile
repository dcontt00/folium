# Stage 1: Build the backend
FROM node:20-alpine AS backend-builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json, yarn.lock and tsconfig.json to the working directory
COPY backend/package.json backend/yarn.lock backend/tsconfig.json ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the backend application code to the working directory
COPY backend/src ./src

# Build the TypeScript code
RUN yarn run build

# Stage 2: Build the frontend
FROM node:20-alpine AS frontend-builder

# Set the working directory
WORKDIR /app

# Copy the frontend code
COPY frontend/ ./

# Install dependencies using Yarn
RUN yarn install

# Build the frontend application
RUN yarn run build

# Stage 3: Production image
FROM node:20-alpine AS prod

# Set the working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy the built frontend code to the Nginx HTML directory
COPY --from=frontend-builder /app/dist /app/public

# Copy the built backend code to the production image
COPY --from=backend-builder /usr/src/app/dist /app
COPY --from=backend-builder /usr/src/app/node_modules /app/node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]