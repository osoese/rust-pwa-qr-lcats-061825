@echo off
echo Building and running Rust PWA application...

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo Docker is running.

REM Clean up any existing containers
echo Cleaning up existing containers...
docker-compose down

REM Build and run the application
echo Building and starting the application...
docker-compose up --build

REM The application will be available at http://localhost:8080
pause
