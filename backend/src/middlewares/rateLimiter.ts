import rateLimit, { ipKeyGenerator } from 'express-rate-limit'
import { Request } from 'express'
import { AuthenticatedRequest } from '../types'

// Authenticated routes should be limited per-user, not per-IP. Keying by IP
// drains a single shared bucket when many users sit behind one address — every
// request from localhost in development, or behind a reverse proxy / NAT in
// production. Falls back to an IPv6-safe IP key for unauthenticated requests.
const userOrIpKeyGenerator = (req: Request): string => {
  const userId = (req as AuthenticatedRequest).user?.userId
  if (userId) return `user:${userId}`
  return ipKeyGenerator(req.ip ?? '')
}

// CORS preflight requests are issued automatically by the browser for every
// cross-origin state-changing request. They should not consume the budget.
const skipPreflight = (req: Request): boolean => req.method === 'OPTIONS'

// Global rate limiter applied at the app level to all API routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  message: {
    error: 'Too many requests',
    details: 'You have exceeded the global rate limit. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKeyGenerator,
  skip: skipPreflight,
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many requests',
    details: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skip: skipPreflight,
})


export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    error: 'Too many requests',
    details: 'You have exceeded the rate limit. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKeyGenerator,
  skip: skipPreflight,
})


export const sensitiveOpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    error: 'Too many requests',
    details: 'Too many attempts. Please try again in an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKeyGenerator,
  skip: skipPreflight,
})


export const resendVerificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2,
  message: {
    error: 'Too many requests',
    details: 'Please wait before requesting another verification email.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKeyGenerator,
  skip: skipPreflight,
})

export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests',
    details: 'You have exceeded the admin rate limit. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKeyGenerator,
  skip: skipPreflight,
})

export const socketTokenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'Too many requests',
    details: 'Too many socket token requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKeyGenerator,
  skip: skipPreflight,
})

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    error: 'Too many requests',
    details: 'Too many upload attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userOrIpKeyGenerator,
  skip: skipPreflight,
})
