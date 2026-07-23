// Email regex — RFC-compliant, no consecutive dots, no leading/trailing dots
export const EMAIL_REGEX = /^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export const validateEmail = (email) => EMAIL_REGEX.test(email.trim());

// Password rules — must match backend authController validateSignup
const PASSWORD_RULES = [
  { id: 'length', test: (p) => p.length >= 8, label: 'At least 8 characters' },
  { id: 'upper', test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { id: 'lower', test: (p) => /[a-z]/.test(p), label: 'One lowercase letter' },
  { id: 'number', test: (p) => /\d/.test(p), label: 'One number' },
  { id: 'special', test: (p) => /[@$!%*?&#]/.test(p), label: 'One special character (@$!%*?&#)' },
];

export const getPasswordRules = (password) =>
  PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) }));

// Returns 0–4 strength score
export const getPasswordStrength = (password) => {
  if (!password) return 0;
  return Math.min(PASSWORD_RULES.filter((r) => r.test(password)).length, 4);
};

export const STRENGTH_CONFIG = [
  { label: 'Too weak', color: 'bg-red-500', text: 'text-red-500' },
  { label: 'Weak', color: 'bg-orange-500', text: 'text-orange-500' },
  { label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-500' },
  { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' },
  { label: 'Strong', color: 'bg-green-500', text: 'text-green-500' },
];
