import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Generate secure random strings
const generateSecret = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

const generatePassword = (length = 16) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Generate production secrets
const generateProductionSecrets = () => {
  const secrets = {
    JWT_SECRET: generateSecret(64),
    JWT_REFRESH_SECRET: generateSecret(64),
    ADMIN_PASSWORD: generatePassword(20),
    MONGODB_PASSWORD: generatePassword(16),
    SESSION_SECRET: generateSecret(32)
  };

  console.log('🔐 Generated Production Secrets:');
  console.log('================================');
  console.log('');
  console.log('⚠️  IMPORTANT: Store these securely and update your .env.production file');
  console.log('');
  
  Object.entries(secrets).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });

  console.log('');
  console.log('📝 Instructions:');
  console.log('1. Copy these values to your .env.production file');
  console.log('2. Update your MongoDB Atlas password');
  console.log('3. Change the admin email to your domain');
  console.log('4. Never commit these secrets to version control');
  console.log('');

  // Save to a secure file (add to .gitignore)
  const secretsFile = path.join(process.cwd(), 'production-secrets.txt');
  const secretsContent = `# Production Secrets - Generated ${new Date().toISOString()}
# ⚠️ KEEP THIS FILE SECURE - DO NOT COMMIT TO VERSION CONTROL

${Object.entries(secrets).map(([key, value]) => `${key}=${value}`).join('\n')}

# Additional Configuration Needed:
# - Update MONGO_URI with your MongoDB Atlas connection string
# - Update CLOUDINARY_* with your production Cloudinary credentials
# - Update EMAIL_* with your production email service credentials
# - Update CLIENT_URL with your production domain
# - Update ADMIN_EMAIL with your domain email
`;

  fs.writeFileSync(secretsFile, secretsContent);
  console.log(`💾 Secrets saved to: ${secretsFile}`);
  console.log('🔒 Make sure to add this file to .gitignore!');
};

// Add to .gitignore if not already present
const updateGitignore = () => {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const secretsToIgnore = [
    'production-secrets.txt',
    '.env.production',
    '*.pem',
    '*.key',
    'ssl/',
    'secrets/'
  ];

  let gitignoreContent = '';
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }

  let updated = false;
  secretsToIgnore.forEach(item => {
    if (!gitignoreContent.includes(item)) {
      gitignoreContent += `\n${item}`;
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log('📝 Updated .gitignore with security files');
  }
};

// Main execution
console.log('🔐 Production Security Setup');
console.log('============================');
console.log('');

generateProductionSecrets();
updateGitignore();

console.log('');
console.log('✅ Security setup completed!');
console.log('');
console.log('Next steps:');
console.log('1. Update Backend/.env.production with generated secrets');
console.log('2. Set up MongoDB Atlas cluster');
console.log('3. Configure Cloudinary production account');
console.log('4. Set up production email service (SendGrid/AWS SES)');
console.log('5. Purchase and configure SSL certificate');
console.log('6. Set up domain and DNS records');
console.log('7. Run deployment script');