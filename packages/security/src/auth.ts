import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SALT_ROUNDS = 10

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// JWT tokens
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'eventhour',
  })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'eventhour',
  }) as JWTPayload
}

export function generateRefreshToken(): string {
  return randomBytes(32).toString('hex')
}

// Session management
export function generateSessionId(): string {
  return randomBytes(32).toString('hex')
}

// CSRF tokens
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Passwort muss mindestens 8 Zeichen lang sein')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Passwort muss mindestens einen Großbuchstaben enthalten')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Passwort muss mindestens einen Kleinbuchstaben enthalten')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Passwort muss mindestens eine Zahl enthalten')
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Passwort muss mindestens ein Sonderzeichen enthalten')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Two-factor authentication
export function generateTOTPSecret(): string {
  return randomBytes(20).toString('hex')
}

export function generateBackupCodes(count: number = 10): string[] {
  return Array.from({ length: count }, () => 
    randomBytes(4).toString('hex').toUpperCase()
  )
}