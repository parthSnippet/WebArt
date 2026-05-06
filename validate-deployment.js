#!/usr/bin/env node

/**
 * Pre-Deployment Validation Script
 * Run this before deploying to production to catch common issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let errors = 0;
let warnings = 0;
let passed = 0;

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkPass(message) {
  log(`✅ ${message}`, colors.green);
  passed++;
}

function checkFail(message) {
  log(`❌ ${message}`, colors.red);
  errors++;
}

function checkWarn(message) {
  log(`⚠️  ${message}`, colors.yellow);
  warnings++;
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    checkPass(`${description} exists`);
    return true;
  } else {
    checkFail(`${description} not found: ${filePath}`);
    return false;
  }
}

function checkEnvVariable(envContent, varName, description) {
  const regex = new RegExp(`^${varName}=.+`, 'm');
  if (regex.test(envContent)) {
    const value = envContent.match(regex)[0].split('=')[1];
    if (value && value.trim() && !value.includes('your_') && !value.includes('CHANGE_THIS')) {
      checkPass(`${description} is configured`);
      return true;
    } else {
      checkFail(`${description} needs to be updated`);
      return false;
    }
  } else {
    checkFail(`${description} is missing`);
    return false;
  }
}

function checkWeakSecret(envContent, varName, minLength = 32) {
  const regex = new RegExp(`^${varName}=(.+)`, 'm');
  if (regex.test(envContent)) {
    const value = envContent.match(regex)[1].trim();
    if (value.length >= minLength) {
      checkPass(`${varName} is strong (${value.length} characters)`);
      return true;
    } else {
      checkFail(`${varName} is too weak (${value.length} chars, need ${minLength}+)`);
      return false;
    }
  }
  return false;
}

console.log('\n' + '='.repeat(60));
log('🔍 PRE-DEPLOYMENT VALIDATION', colors.blue);
console.log('='.repeat(60) + '\n');

// Check Backend Files
log('\n📦 Checking Backend Files...', colors.blue);
const backendEnvProd = path.join(__dirname, 'Backend', '.env.production');
const backendDockerfile = path.join(__dirname, 'Backend', 'Dockerfile');
const healthcheck = path.join(__dirname, 'Backend', 'healthcheck.js');

checkFileExists(backendEnvProd, 'Backend production environment file');
checkFileExists(backendDockerfile, 'Backend Dockerfile');
checkFileExists(healthcheck, 'Backend health check script');

// Check Frontend Files
log('\n📦 Checking Frontend Files...', colors.blue);
const frontendEnvProd = path.join(__dirname, 'Mehndi Web', '.env.production');
const frontendDockerfile = path.join(__dirname, 'Mehndi Web', 'Dockerfile');
const nginxConf = path.join(__dirname, 'Mehndi Web', 'nginx.conf');

checkFileExists(frontendEnvProd, 'Frontend production environment file');
checkFileExists(frontendDockerfile, 'Frontend Dockerfile');
checkFileExists(nginxConf, 'Nginx configuration');

// Check Docker Compose
log('\n🐳 Checking Docker Configuration...', colors.blue);
const dockerCompose = path.join(__dirname, 'docker-compose.prod.yml');
checkFileExists(dockerCompose, 'Docker Compose production file');

// Validate Backend Environment Variables
if (fs.existsSync(backendEnvProd)) {
  log('\n🔐 Validating Backend Environment Variables...', colors.blue);
  const backendEnv = fs.readFileSync(backendEnvProd, 'utf8');
  
  checkEnvVariable(backendEnv, 'NODE_ENV', 'NODE_ENV');
  checkEnvVariable(backendEnv, 'MONGO_URI', 'MongoDB connection string');
  checkEnvVariable(backendEnv, 'JWT_SECRET', 'JWT secret');
  checkEnvVariable(backendEnv, 'JWT_REFRESH_SECRET', 'JWT refresh secret');
  checkEnvVariable(backendEnv, 'CLOUDINARY_CLOUD_NAME', 'Cloudinary cloud name');
  checkEnvVariable(backendEnv, 'CLOUDINARY_API_KEY', 'Cloudinary API key');
  checkEnvVariable(backendEnv, 'CLOUDINARY_API_SECRET', 'Cloudinary API secret');
  checkEnvVariable(backendEnv, 'ADMIN_EMAIL', 'Admin email');
  checkEnvVariable(backendEnv, 'ADMIN_PASSWORD', 'Admin password');
  checkEnvVariable(backendEnv, 'EMAIL_HOST', 'Email host');
  checkEnvVariable(backendEnv, 'EMAIL_PASS', 'Email password');
  checkEnvVariable(backendEnv, 'CLIENT_URL', 'Client URL');
  
  // Check secret strength
  log('\n🔒 Checking Secret Strength...', colors.blue);
  checkWeakSecret(backendEnv, 'JWT_SECRET', 32);
  checkWeakSecret(backendEnv, 'JWT_REFRESH_SECRET', 32);
  checkWeakSecret(backendEnv, 'ADMIN_PASSWORD', 12);
  
  // Check for default values
  log('\n⚠️  Checking for Default Values...', colors.blue);
  if (backendEnv.includes('Admin@123')) {
    checkWarn('Default admin password detected - should be changed');
  }
  if (backendEnv.includes('admin@mehndi.com')) {
    checkWarn('Default admin email detected - should be changed to your domain');
  }
  if (backendEnv.includes('localhost')) {
    checkWarn('localhost detected in production config');
  }
}

// Validate Frontend Environment Variables
if (fs.existsSync(frontendEnvProd)) {
  log('\n🌐 Validating Frontend Environment Variables...', colors.blue);
  const frontendEnv = fs.readFileSync(frontendEnvProd, 'utf8');
  
  checkEnvVariable(frontendEnv, 'VITE_API_URL', 'API URL');
  checkEnvVariable(frontendEnv, 'VITE_SOCKET_URL', 'Socket URL');
  
  if (frontendEnv.includes('localhost')) {
    checkWarn('localhost detected in frontend production config');
  }
}

// Check Dependencies
log('\n📚 Checking Dependencies...', colors.blue);
const backendPackage = path.join(__dirname, 'Backend', 'package.json');
if (fs.existsSync(backendPackage)) {
  const pkg = JSON.parse(fs.readFileSync(backendPackage, 'utf8'));
  if (pkg.dependencies.hpp) {
    checkPass('hpp security package installed');
  } else {
    checkFail('hpp package missing - run: cd Backend && npm install hpp');
  }
  if (pkg.dependencies.helmet) {
    checkPass('helmet security package installed');
  }
  if (pkg.dependencies['express-rate-limit']) {
    checkPass('express-rate-limit package installed');
  }
}

// Check .gitignore
log('\n🔒 Checking Security Files...', colors.blue);
const backendGitignore = path.join(__dirname, 'Backend', '.gitignore');
if (fs.existsSync(backendGitignore)) {
  const gitignore = fs.readFileSync(backendGitignore, 'utf8');
  if (gitignore.includes('.env.production')) {
    checkPass('.env.production is in .gitignore');
  } else {
    checkFail('.env.production should be in .gitignore');
  }
  if (gitignore.includes('production-secrets.txt')) {
    checkPass('production-secrets.txt is in .gitignore');
  } else {
    checkWarn('production-secrets.txt should be in .gitignore');
  }
}

// Summary
console.log('\n' + '='.repeat(60));
log('📊 VALIDATION SUMMARY', colors.blue);
console.log('='.repeat(60));
log(`✅ Passed: ${passed}`, colors.green);
log(`⚠️  Warnings: ${warnings}`, colors.yellow);
log(`❌ Errors: ${errors}`, colors.red);
console.log('='.repeat(60) + '\n');

if (errors > 0) {
  log('❌ DEPLOYMENT BLOCKED - Fix errors before deploying', colors.red);
  log('\nRecommended actions:', colors.yellow);
  log('1. Run: node generate-secrets.js', colors.yellow);
  log('2. Update Backend/.env.production with generated secrets', colors.yellow);
  log('3. Update Mehndi Web/.env.production with your domain', colors.yellow);
  log('4. Run: cd Backend && npm install hpp', colors.yellow);
  process.exit(1);
} else if (warnings > 0) {
  log('⚠️  WARNINGS DETECTED - Review before deploying', colors.yellow);
  log('\nYou can proceed, but consider fixing warnings for better security.', colors.yellow);
  process.exit(0);
} else {
  log('✅ ALL CHECKS PASSED - Ready for deployment!', colors.green);
  log('\nNext steps:', colors.blue);
  log('1. Review your environment variables one more time', colors.blue);
  log('2. Run deployment script: ./deploy.sh (or deploy.bat on Windows)', colors.blue);
  log('3. Monitor logs after deployment', colors.blue);
  process.exit(0);
}