FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Install OpenJDK 17
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends openjdk-17-jdk

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install uv (Python tools manager)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Install ghstack via uv
RUN /root/.cargo/bin/uv tool install ghstack

# Add uv to PATH
ENV PATH="/root/.cargo/bin:${PATH}"

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
