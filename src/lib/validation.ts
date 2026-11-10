/**
 * Input sanitization and validation utilities for production readiness
 */

// Simple HTML/XSS tag stripping
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // Strip raw angle brackets
    .trim();
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  // RFC 5322 compliant practical regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  // Accepts international format e.g. +1 (212) 555-0199 or +33 1 42 68 55 00
  const cleaned = phone.replace(/[\s()-]/g, "");
  return /^(\+?\d{7,15})$/.test(cleaned);
}

export function isValidDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime());
}

export function isValidHttpUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export interface PasswordStrengthResult {
  valid: boolean;
  errors: string[];
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one numeric digit.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
