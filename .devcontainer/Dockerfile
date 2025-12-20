# Development image for devcontainer
FROM node:20-bookworm

# Install build essentials for native dependencies (SQLite)
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Expose Next.js dev port
EXPOSE 3000

# Keep container running (devcontainer will mount code and run postCreateCommand)
CMD ["sleep", "infinity"]
