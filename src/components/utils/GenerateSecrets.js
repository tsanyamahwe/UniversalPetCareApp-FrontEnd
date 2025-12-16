import crypto from 'crypto';

function generateSecret(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}

console.log('\n🔐 Generated Secrets for Your .env File:\n');
console.log('Copy these into your backend .env file:\n');
console.log('─'.repeat(80));
console.log(`SESSION_SECRET=${generateSecret(64)}`);
console.log(`JWT_SECRET=${generateSecret(32)}`);
console.log('─'.repeat(80));
console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
console.log('1. Never commit these secrets to git');
console.log('2. Use different secrets for development and production');
console.log('3. Store production secrets securely (use environment variables or secret managers)');
console.log('4. Rotate secrets periodically for better security\n');