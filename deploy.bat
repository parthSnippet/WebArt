@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting Production Deployment for Windows...

REM Colors (limited in Windows CMD)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "NC=[0m"

echo %GREEN%[INFO]%NC% Checking deployment requirements...

REM Check if required files exist
if not exist "Backend\.env.production" (
    echo %RED%[ERROR]%NC% Backend\.env.production file not found!
    pause
    exit /b 1
)

if not exist "Mehndi Web\.env.production" (
    echo %RED%[ERROR]%NC% Frontend\.env.production file not found!
    pause
    exit /b 1
)

echo %GREEN%[INFO]%NC% ✅ All required files found

REM Build backend
echo %GREEN%[INFO]%NC% Building backend...
cd Backend
call npm ci --only=production
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Backend build failed!
    pause
    exit /b 1
)
cd ..

REM Build frontend
echo %GREEN%[INFO]%NC% Building frontend...
cd "Mehndi Web"
call npm ci
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Frontend dependencies installation failed!
    pause
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Frontend build failed!
    pause
    exit /b 1
)
cd ..

REM Docker deployment
echo %GREEN%[INFO]%NC% Deploying with Docker...
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

REM Wait for services
echo %GREEN%[INFO]%NC% Waiting for services to start...
timeout /t 30 /nobreak > nul

REM Health check
echo %GREEN%[INFO]%NC% Performing health checks...
curl -f http://localhost:5000/api/health > nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Backend health check failed!
    pause
    exit /b 1
)

echo %GREEN%[INFO]%NC% ✅ Backend health check passed

curl -f http://localhost:80/health > nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Frontend health check failed!
    pause
    exit /b 1
)

echo %GREEN%[INFO]%NC% ✅ Frontend health check passed

echo %GREEN%[INFO]%NC% 🎉 Deployment completed successfully!
echo %GREEN%[INFO]%NC% Backend: http://localhost:5000
echo %GREEN%[INFO]%NC% Frontend: http://localhost:80
echo %YELLOW%[WARNING]%NC% Don't forget to:
echo %YELLOW%[WARNING]%NC% 1. Set up SSL certificates
echo %YELLOW%[WARNING]%NC% 2. Configure your domain DNS
echo %YELLOW%[WARNING]%NC% 3. Set up monitoring and backups

pause