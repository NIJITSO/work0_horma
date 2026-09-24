import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import {
  verifyPassword,
  createSessionToken,
  ADMIN_COOKIE_NAME,
  ensureDefaultAdmin,
} from '../../../../lib/auth';

export async function POST(request: Request) {
  try {
    await ensureDefaultAdmin();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Veuillez saisir votre email et votre mot de passe.' },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!admin || !verifyPassword(password, admin.password)) {
      return NextResponse.json(
        { success: false, error: 'Identifiants incorrects. Accès refusé.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(admin);

    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set secure httpOnly cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Une erreur interne est survenue.' },
      { status: 500 }
    );
  }
}
