# Use Node.js 18 Alpine as base image
# syntax=docker/dockerfile:1.4

# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install system dependencies (keep this layer stable)
RUN apk add --no-cache \
    python3 \
    python3-dev \
    py3-pip \
    swig \
    ruby \
    ruby-bundler \
    ruby-dev \
    ruby-nokogiri \
    build-base \
    clang \
    clang-dev \
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
ENV PATH="/app/scripts/venv/bin:$PATH"

# Puppeteer config to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Working dir
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# --- NODE deps: copy lockfiles only (cacheable) ---
COPY package.json pnpm-lock.yaml ./
# Use buildkit cache for pnpm store to speed repeated installs
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --store-dir=/root/.pnpm-store

# --- Python deps: copy requirements only and use pip cache ---
COPY scripts/requirements.txt scripts/requirements.txt
RUN --mount=type=cache,id=pip-cache,target=/root/.cache/pip \
    pip install --no-cache-dir -r scripts/requirements.txt

# Install editable local Python package and cache wheels/builds
COPY scripts/libgen-api-enhanced/ scripts/libgen-api-enhanced/
RUN --mount=type=cache,id=pip-cache,target=/root/.cache/pip \
    pip install --no-cache-dir -e scripts/libgen-api-enhanced/

# --- Ruby deps: copy Gemfile and Gemfile.lock only and cache gems ---
COPY scripts/academia-dl/Gemfile scripts/academia-dl/Gemfile.lock scripts/academia-dl/
RUN --mount=type=cache,id=bundle-cache,target=/usr/local/bundle \
    cd scripts/academia-dl && \
    bundle config set --local deployment 'false' && \
    bundle config set --local path 'vendor/bundle' && \
    bundle install --jobs 4 --retry 3

# Set Ruby gem env vars to use vendor bundle produced above
ENV GEM_HOME=/app/scripts/academia-dl/vendor/bundle/ruby/3.3.0
ENV GEM_PATH=/app/scripts/academia-dl/vendor/bundle/ruby/3.3.0:$GEM_PATH
ENV PATH=/app/scripts/academia-dl/vendor/bundle/ruby/3.3.0/bin:$PATH

# --- scribd-dl: install dependencies with pnpm using same pnpm cache ---
COPY scripts/scribd-dl/package.json scripts/scribd-dl/pnpm-lock.yaml scripts/scribd-dl/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    cd scripts/scribd-dl && pnpm install --store-dir=/root/.pnpm-store

# Copy remainder of application (performed after dependency steps to leverage cache)
COPY . .

# Build the Next.js application
RUN pnpm build

# Expose port 3001
EXPOSE 3001

# Start command
CMD ["pnpm", "start"]
CMD ["pnpm", "start"]