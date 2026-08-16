# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ruby \
    ruby-bundler \
    ruby-dev \
    ruby-nokogiri \
    build-base \
    chromium \
    chromium-chromedriver \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    libxml2-dev \
    libxslt-dev \
    zlib-dev

# Create virtual environment in /app/scripts/venv for consistency
RUN python3 -m venv /app/scripts/venv

# Set PATH to use venv
ENV PATH="/app/scripts/venv/bin:$PATH"

# Set Puppeteer to skip downloading Chromium (use system Chromium)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install Node.js dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Install Python dependencies in venv (after copying scripts folder)
RUN pip install -r scripts/requirements.txt

# Install libgen-api-enhanced Python package
RUN pip install -e scripts/libgen-api-enhanced/

# Install Ruby dependencies for academia-dl
RUN cd scripts/academia-dl && \
    bundle config set --local deployment 'false' && \
    bundle config set --local path 'vendor/bundle' && \
    bundle install --jobs 4 --retry 3

# Install Node.js dependencies for scribd-dl
RUN cd scripts/scribd-dl && pnpm install

# Set Ruby environment to find gems
ENV GEM_HOME=/app/scripts/academia-dl/vendor/bundle/ruby/3.3.0
ENV GEM_PATH=/app/scripts/academia-dl/vendor/bundle/ruby/3.3.0:$GEM_PATH
ENV PATH=/app/scripts/academia-dl/vendor/bundle/ruby/3.3.0/bin:$PATH

# Build the Next.js application
RUN pnpm build

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["pnpm", "start"]