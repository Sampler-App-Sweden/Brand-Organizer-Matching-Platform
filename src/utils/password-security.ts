/**
 * Password Security Utilities
 * Implements HaveIBeenPwned (HIBP) password checking using k-anonymity
 * This provides leaked password protection when Supabase Pro plan is not available
 */

/**
 * SHA-1 hash function using Web Crypto API (browser-compatible)
 * @param text - Text to hash
 * @returns Promise<string> - Hex-encoded SHA-1 hash
 */
async function sha1Hash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex.toUpperCase();
}

/**
 * Check if a password has been exposed in known data breaches
 * Uses the HaveIBeenPwned API with k-anonymity (only sends first 5 chars of hash)
 * @param password - The password to check
 * @returns Promise<boolean> - true if password is compromised, false if safe
 */
export async function isPasswordPwned(password: string): Promise<boolean> {
  try {
    // 1. Hash the password using SHA-1 (HIBP requirement)
    const sha1Digest = await sha1Hash(password);

    // 2. Split hash: first 5 chars (prefix) and rest (suffix)
    const prefix = sha1Digest.substring(0, 5);
    const suffix = sha1Digest.substring(5);

    // 3. Query HIBP API with only the prefix (k-anonymity for privacy)
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: {
          'User-Agent': 'Brand-Organizer-Platform-Password-Check',
        },
      }
    );

    if (!response.ok) {
      // If API fails, log error but don't block user (fail open)
      console.error('HIBP API error:', response.status);
      return false; // Fail open - don't block user if API is down
    }

    // 4. Parse response: each line is "SUFFIX:COUNT"
    const text = await response.text();
    const hashes = text.split('\n');

    // 5. Check if our password's suffix appears in the results
    for (const line of hashes) {
      const [hashSuffix] = line.split(':');
      if (hashSuffix === suffix) {
        return true; // Password is pwned!
      }
    }

    return false; // Password is safe
  } catch (error) {
    // Log error but fail open (don't block users if check fails)
    console.error('Error checking password against HIBP:', error);
    return false;
  }
}

/**
 * Validate password meets security requirements
 * @param password - Password to validate
 * @returns Object with validation result and error message
 */
export async function validatePassword(password: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  // Check minimum length (matches your Supabase setting: 8 chars)
  if (password.length < 8) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  // Check password requirements: lowercase, uppercase, and digits
  // This matches your Supabase configuration
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);

  if (!hasLowercase || !hasUppercase || !hasDigit) {
    return {
      valid: false,
      error:
        'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
    };
  }

  // Check against HIBP
  const isPwned = await isPasswordPwned(password);
  if (isPwned) {
    return {
      valid: false,
      error:
        'This password has appeared in a data breach and cannot be used. Please choose a more secure password.',
    };
  }

  return { valid: true };
}

/**
 * Example usage in your signup/password reset forms:
 *
 * ```typescript
 * import { validatePassword } from '@/utils/password-security';
 *
 * async function handleSignup(email: string, password: string) {
 *   // Validate password before sending to Supabase
 *   const validation = await validatePassword(password);
 *
 *   if (!validation.valid) {
 *     setError(validation.error);
 *     return;
 *   }
 *
 *   // Proceed with signup
 *   const { error } = await supabase.auth.signUp({ email, password });
 *   // ...
 * }
 * ```
 */
