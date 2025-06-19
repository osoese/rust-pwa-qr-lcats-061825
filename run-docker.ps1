# PowerShell script to build and run the Rust PWA application
# Usage: .\run-docker.ps1

Write-Host "Building and running Rust PWA application..." -ForegroundColor Green

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "Docker is running." -ForegroundColor Green
} catch {
    Write-Host "Error: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Clean up any existing containers
Write-Host "Cleaning up existing containers..." -ForegroundColor Yellow
docker-compose down

# Build and run the application
Write-Host "Building and starting the application..." -ForegroundColor Yellow
docker-compose up --build

# The application will be available at http://localhost:8080
