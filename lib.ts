import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/api";

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1 hr from now')
        .sign(key);
}

export async function decrypt(token: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const session = await encrypt({ username, password });

    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true });
}

export async function register(formData: FormData) {
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 1. Validation
    if (!email || !email.includes('@')) {
        throw new Error('Invalid email address.');
    }
    if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
    }

    // 2. Action: Create a new user in Strapi
    const strapiRes = await fetch(`${API_BASE_URL}/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    if (!strapiRes.ok) {
        const errorData = await strapiRes.json();
        throw new Error(errorData.error?.message || 'Failed to register with Strapi');
    }

    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const session = await encrypt({ username, email, password });

    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true });
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
