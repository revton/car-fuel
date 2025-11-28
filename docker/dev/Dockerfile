FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Install OpenJDK 17
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends openjdk-17-jdk-headless

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install uv (Python tools manager)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Install ghstack via uv
RUN uv tool install ghstack

# Add uv to PATH (not needed as it is in /usr/local/bin, but we might need to add the tool bin path)
ENV PATH="/root/.local/bin:${PATH}"

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
