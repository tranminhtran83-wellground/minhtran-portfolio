/**
 * Input Validation and Sanitization
 * Protects against injection attacks, XSS, and malicious input
 */

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
  sanitized?: string
}

/**
 * Validate file upload
 * Rules:
 * - File size: max 10MB
 * - Allowed types: .pdf, .docx, .txt
 * - Validate MIME type (not just extension)
 * - Sanitize filename
 */
export interface FileValidationOptions {
  maxSizeBytes?: number // Default: 10MB
  allowedTypes?: string[] // Default: ['pdf', 'docx', 'txt']
  allowedMimeTypes?: string[] // Default: application/pdf, etc.
}

export function validateFile(
  file: File,
  options?: FileValidationOptions
): ValidationResult {
  const maxSize = options?.maxSizeBytes || 10 * 1024 * 1024 // 10MB
  const allowedTypes = options?.allowedTypes || ['pdf', 'docx', 'txt', 'doc']
  const allowedMimeTypes = options?.allowedMimeTypes || [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'text/plain',
  ]

  // Check file exists
  if (!file) {
    return {
      isValid: false,
      error: 'Vui lòng chọn file / Please select a file',
    }
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0)
    return {
      isValid: false,
      error: `File quá lớn (tối đa ${maxSizeMB}MB) / File is too large (max ${maxSizeMB}MB)`,
    }
  }

  // Check file size is not 0
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File rỗng / File is empty',
    }
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !allowedTypes.includes(extension)) {
    return {
      isValid: false,
      error: `Loại file không hợp lệ. Chỉ chấp nhận: ${allowedTypes.join(', ')} / Invalid file type. Only accept: ${allowedTypes.join(', ')}`,
    }
  }

  // Check MIME type
  if (!allowedMimeTypes.includes(file.type)) {
    console.warn('[Validation] Invalid MIME type:', {
      filename: file.name,
      mimeType: file.type,
      expectedTypes: allowedMimeTypes,
    })
    return {
      isValid: false,
      error: `Loại file không hợp lệ / Invalid file type`,
    }
  }

  // Sanitize filename (remove special characters, prevent path traversal)
  const sanitizedFilename = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
    .replace(/\.\.+/g, '.') // Remove multiple dots (path traversal attempt)
    .replace(/^\./, '_') // Remove leading dot
    .substring(0, 255) // Limit filename length

  return {
    isValid: true,
    sanitized: sanitizedFilename,
  }
}

/**
 * Validate URL
 * Rules:
 * - Must be valid URL format
 * - Optional: Allowed domains only
 */
export function validateUrl(
  url: string,
  allowedDomains?: string[]
): ValidationResult {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'URL là bắt buộc / URL is required',
    }
  }

  const trimmed = url.trim()

  // Check URL format
  let parsedUrl: URL
  try {
    parsedUrl = new URL(trimmed)
  } catch (error) {
    return {
      isValid: false,
      error: 'URL không hợp lệ / Invalid URL format',
    }
  }

  // Check protocol (only http/https)
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return {
      isValid: false,
      error: 'URL phải sử dụng HTTP hoặc HTTPS / URL must use HTTP or HTTPS',
    }
  }

  // Check allowed domains if specified
  if (allowedDomains && allowedDomains.length > 0) {
    const hostname = parsedUrl.hostname.toLowerCase()
    const isAllowed = allowedDomains.some((domain) =>
      hostname.endsWith(domain.toLowerCase())
    )

    if (!isAllowed) {
      return {
        isValid: false,
        error: `Domain không được phép. Chỉ chấp nhận: ${allowedDomains.join(', ')} / Domain not allowed. Only accept: ${allowedDomains.join(', ')}`,
      }
    }
  }

  return {
    isValid: true,
    sanitized: parsedUrl.toString(),
  }
}

/**
 * Sanitize markdown content
 * Removes potentially dangerous HTML/JavaScript while preserving markdown
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  let sanitized = markdown

  // Remove script tags (use [\s\S] instead of 's' flag for ES5 compatibility)
  sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')

  // Remove iframes (use [\s\S] instead of 's' flag)
  sanitized = sanitized.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')

  // Remove objects and embeds (use [\s\S] instead of 's' flag)
  sanitized = sanitized.replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
  sanitized = sanitized.replace(/<embed[^>]*>/gi, '')

  return sanitized
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email là bắt buộc / Email is required',
    }
  }

  const trimmed = email.trim().toLowerCase()

  // Basic email regex (not perfect but good enough)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Email không hợp lệ / Invalid email format',
    }
  }

  // Check for common typos
  const commonTypos = ['gmial.com', 'gmai.com', 'yahooo.com', 'hotmial.com']
  const domain = trimmed.split('@')[1]
  if (commonTypos.includes(domain)) {
    return {
      isValid: false,
      error: 'Email có vẻ sai chính tả / Email appears to have a typo',
    }
  }

  return {
    isValid: true,
    sanitized: trimmed,
  }
}
