import DOMPurify from 'isomorphic-dompurify'

// XSS prevention
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  })
}

export function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return text.replace(/[&<>"'/]/g, char => map[char])
}

// JSON sanitization
export function sanitizeJSON(obj: any): any {
  if (typeof obj === 'string') {
    return escapeHTML(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeJSON(item))
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Sanitize both key and value
        const sanitizedKey = escapeHTML(key)
        sanitized[sanitizedKey] = sanitizeJSON(obj[key])
      }
    }
    return sanitized
  }
  
  return obj
}

// URL sanitization
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url)
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }
    
    // Remove any javascript: or data: URLs
    if (url.includes('javascript:') || url.includes('data:')) {
      return null
    }
    
    return parsed.toString()
  } catch {
    return null
  }
}

// Email sanitization
export function sanitizeEmail(email: string): string {
  // Remove any HTML tags and trim whitespace
  return email
    .replace(/<[^>]*>/g, '')
    .trim()
    .toLowerCase()
}

// Phone number sanitization
export function sanitizePhone(phone: string): string {
  // Keep only digits and + sign
  return phone.replace(/[^\d+]/g, '')
}

// Credit card masking
export function maskCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '')
  if (cleaned.length < 12) return '****'
  
  const last4 = cleaned.slice(-4)
  const masked = '*'.repeat(cleaned.length - 4)
  
  // Format as groups of 4
  const formatted = (masked + last4).match(/.{1,4}/g)?.join(' ') || ''
  return formatted
}

// Personal data masking
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!domain) return '***'
  
  const maskedLocal = localPart.charAt(0) + 
    '*'.repeat(Math.max(localPart.length - 2, 1)) + 
    localPart.charAt(localPart.length - 1)
  
  return `${maskedLocal}@${domain}`
}

export function maskName(name: string): string {
  if (name.length <= 2) return '*'.repeat(name.length)
  return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
}