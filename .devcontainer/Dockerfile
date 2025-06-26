FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install Bun
USER node
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/home/node/.bun/bin:$PATH"

# Verify installation
RUN bun --version && node --version