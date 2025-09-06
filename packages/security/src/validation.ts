import { body, param, query, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

// Input validation rules
export const validationRules = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Ungültige E-Mail-Adresse'),

  password: body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Passwort entspricht nicht den Sicherheitsanforderungen'),

  phone: body('phone')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Ungültige Telefonnummer'),

  url: body('url')
    .optional()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Ungültige URL'),

  price: body('price')
    .isFloat({ min: 0 })
    .withMessage('Preis muss eine positive Zahl sein'),

  id: param('id')
    .isUUID()
    .withMessage('Ungültige ID'),

  pagination: [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
}

// Validation middleware
export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array(),
      message: 'Validierungsfehler',
    })
  }
  next()
}

// SQL injection prevention
export function sanitizeSQLInput(input: string): string {
  // Remove dangerous SQL keywords and characters
  const dangerous = [
    'DROP', 'DELETE', 'INSERT', 'UPDATE', 'SELECT',
    'UNION', 'OR', 'AND', '--', '/*', '*/', ';'
  ]
  
  let sanitized = input
  dangerous.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi')
    sanitized = sanitized.replace(regex, '')
  })
  
  return sanitized.trim()
}

// Path traversal prevention
export function sanitizePath(path: string): string {
  // Remove path traversal attempts
  return path
    .replace(/\.\./g, '')
    .replace(/~\//g, '')
    .replace(/^\/+/, '')
}

// Command injection prevention
export function sanitizeCommand(command: string): string {
  // Remove shell metacharacters
  const dangerous = ['&', '|', ';', '$', '>', '<', '`', '\\', '!', '\n', '\r']
  let sanitized = command
  
  dangerous.forEach(char => {
    sanitized = sanitized.replace(new RegExp('\\' + char, 'g'), '')
  })
  
  return sanitized
}

// File upload validation
export function validateFileUpload(file: Express.Multer.File): {
  isValid: boolean
  error?: string
} {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ]
  
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: 'Nicht erlaubter Dateityp',
    }
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Datei ist zu groß (max. 10MB)',
    }
  }
  
  // Check file extension matches mime type
  const extension = file.originalname.split('.').pop()?.toLowerCase()
  const expectedExtensions: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf'],
  }
  
  const validExtensions = expectedExtensions[file.mimetype]
  if (!extension || !validExtensions?.includes(extension)) {
    return {
      isValid: false,
      error: 'Dateiendung stimmt nicht mit Dateityp überein',
    }
  }
  
  return { isValid: true }
}