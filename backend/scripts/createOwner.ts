/**
 * One-time local owner provisioning.
 * Usage: OWNER_EMAIL=you@example.com OWNER_PASSWORD='strong-unique-password' npm run owner:create
 * Requires DATABASE_URL and JWT_SECRET configured for the backend.
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/db';

async function main() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD;
  const name = process.env.OWNER_NAME?.trim() || 'Store Owner';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Set a valid OWNER_EMAIL');
  if (!password || password.length < 12) throw new Error('OWNER_PASSWORD must have at least 12 characters');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Account already exists; refusing to change an existing user role');
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, name, password: hashed, role: 'OWNER' } });
  console.log('Owner account created:', email);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
