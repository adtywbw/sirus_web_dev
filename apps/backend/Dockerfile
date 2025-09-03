FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy source
COPY src ./src
COPY db ./db

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Default command runs migrations then starts the API
CMD ["npm", "run", "start:migrated"]

