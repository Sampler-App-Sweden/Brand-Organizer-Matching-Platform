import { PasswordErrors } from './registerTypes'

export function calculatePasswordErrors(password: string): PasswordErrors {
  return {
    length: password.length < 8,
    uppercase: !/[A-Z]/.test(password),
    lowercase: !/[a-z]/.test(password),
    number: !/[0-9]/.test(password)
  }
}

export function calculatePasswordStrength(password: string): number {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  return strength
}
