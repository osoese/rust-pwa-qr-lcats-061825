# Stage 1: Build the application using the official Rust image
FROM rust:latest AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy the project files
COPY Cargo.toml ./
COPY src ./src

# Build the application in release mode
RUN cargo build --release

# Stage 2: Create the final, smaller production image
FROM debian:bookworm-slim

# Install necessary runtime dependencies
RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN useradd -m -u 1000 appuser

# Set the working directory in the final image
WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /usr/src/app/target/release/side_hustle_app .
# Copy the static files required by the application
COPY static ./static

# Change ownership to the non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 8080

# Health check to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# The command to run the binary when the container starts
CMD ["./side_hustle_app"]