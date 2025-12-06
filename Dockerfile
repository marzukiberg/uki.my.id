# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install Python and pip
RUN apk add --no-cache python3 py3-pip

# Create virtual environment
RUN python3 -m venv /venv

# Set PATH to use venv
ENV PATH="/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install bun globally
RUN npm install -g bun

# Install Node.js dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Install Python dependencies in venv
RUN pip install -r scripts/requirements.txt

# Build the Next.js application
RUN bun run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]