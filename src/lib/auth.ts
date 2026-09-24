import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const AUTH_SECRET = process.env.AUTH_SECRET || 'alhurra_super_secret_auth_key_2026_luxury_cosmetics';
export const ADMIN_COOKIE_NAME = 'alhurra_admin_token';

export interface AdminSession {
  id: number;
  email: string;
  name: string;
  role: string;
  exp: number; // Unix timestamp in seconds
}

/**
 * Hash password with PBKDF2 and random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${derivedKey}`;
}

/**
 * Verify password against salt:hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    // Fallback plain-text check for initial seeds if any
    return password === storedHash;
  }
  const [salt, key] = storedHash.split(':');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return key === derivedKey;
}

/**
 * Sign session payload to a safe JWT-like HMAC token
 */
export function createSessionToken(admin: { id: number; email: string; name: string; role?: string }): string {
  const payload: AdminSession = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role || 'admin',
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  const dataStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(dataStr).digest('base64url');
  return `${dataStr}.${signature}`;
}

/**
 * Verify and decode session token
 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [dataStr, signature] = parts;

    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(dataStr).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: AdminSession = JSON.parse(Buffer.from(dataStr, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Get current admin session from incoming cookies (Server Components & Route Handlers)
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Ensure default administrator exists in database
 */
export async function ensureDefaultAdmin() {
  try {
    const count = await prisma.adminUser.count();
    if (count === 0) {
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123456';
      await prisma.adminUser.create({
        data: {
          email: 'admin@alhurra.ma',
          name: 'Directeur Al Hurra',
          password: hashPassword(defaultPassword),
          role: 'superadmin',
        },
      });
      console.log('✅ Created default admin: admin@alhurra.ma / admin123456');
    }
  } catch (e) {
    console.error('Error ensuring default admin:', e);
  }
}
