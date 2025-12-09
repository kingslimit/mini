FROM node:22-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Default command (di docker-compose diganti sama "npm run dev")
CMD ["npm", "run", "dev"]
