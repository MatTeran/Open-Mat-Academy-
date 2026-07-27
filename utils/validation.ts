const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function getEmailError(email: string): string | null {
  if (!email.trim()) {
    return 'Email is required.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  return null;
}

export function getPasswordError(password: string): string | null {
  if (!password) {
    return 'Password is required.';
  }
  if (!isValidPassword(password)) {
    return 'Use at least 8 characters.';
  }
  return null;
}

export function getNameError(name: string): string | null {
  if (!name.trim()) {
    return 'Name is required.';
  }
  if (name.trim().length < 2) {
    return 'Enter your full name.';
  }
  return null;
}

export function getConfirmPasswordError(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) {
    return 'Confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}
