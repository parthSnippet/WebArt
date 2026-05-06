#!/bin/bash

# Production Deployment Script for Mehndi Booking Platform
set -e

echo "🚀 Starting Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_requirements() {
    print_status "Checking deployment requirements..."
    
    if [ ! -f "Backend/.env.production" ]; then
        print_error "Backend/.env.production file not found!"
        exit 1
    fi
    
    if [ ! -f "Mehndi Web/.env.production" ]; then
        print_error "Frontend/.env.production file not found!"
        exit 1
    fi
    
    print_status "✅ All required files found"
}

# Build and deploy backend
deploy_backend() {
    print_status "Building backend..."
    cd Backend
    
    # Install production dependencies
    npm ci --only=production
    
    # Run tests if they exist
    if [ -f "package.json" ] && grep -q "test" package.json; then
        print_status "Running backend tests..."
        npm test
    fi
    
    print_status "✅ Backend ready for deployment"
    cd ..
}

# Build and deploy frontend
deploy_frontend() {
    print_status "Building frontend..."
    cd "Mehndi Web"
    
    # Install dependencies
    npm ci
    
    # Build for production
    npm run build
    
    # Run tests if they exist
    if [ -f "package.json" ] && grep -q "test" package.json; then
        print_status "Running frontend tests..."
        npm test
    fi
    
    print_status "✅ Frontend built successfully"
    cd ..
}

# Docker deployment
deploy_docker() {
    print_status "Deploying with Docker..."
    
    # Build and start containers
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_status "✅ Services are running"
    else
        print_error "❌ Some services failed to start"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
}

# Health check
health_check() {
    print_status "Performing health checks..."
    
    # Check backend health
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        print_status "✅ Backend health check passed"
    else
        print_error "❌ Backend health check failed"
        exit 1
    fi
    
    # Check frontend
    if curl -f http://localhost:80/health > /dev/null 2>&1; then
        print_status "✅ Frontend health check passed"
    else
        print_error "❌ Frontend health check failed"
        exit 1
    fi
}

# Main deployment process
main() {
    print_status "🚀 Mehndi Booking Platform - Production Deployment"
    print_warning "Make sure you have updated all environment variables!"
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deployment cancelled"
        exit 0
    fi
    
    check_requirements
    deploy_backend
    deploy_frontend
    deploy_docker
    health_check
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:80"
    print_warning "Don't forget to:"
    print_warning "1. Set up SSL certificates"
    print_warning "2. Configure your domain DNS"
    print_warning "3. Set up monitoring and backups"
}

# Run main function
main "$@"