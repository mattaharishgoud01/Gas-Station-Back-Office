/** Provision the first store for an existing owner account. */
import 'dotenv/config';
import { prisma } from '../src/db';

async function main() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const name = process.env.STORE_NAME?.trim();
  const location = process.env.STORE_LOCATION?.trim();
  if (!email || !name || !location) throw new Error('OWNER_EMAIL, STORE_NAME, and STORE_LOCATION are required');
  const owner = await prisma.user.findUnique({ where: { email } });
  if (!owner || owner.role !== 'OWNER') throw new Error('OWNER_EMAIL must belong to an existing OWNER');
  const existing = await prisma.store.findFirst({ where: { ownerId: owner.id, name } });
  if (existing) throw new Error('A store with this name already exists for this owner');
  const store = await prisma.store.create({ data: { name, location, ownerId: owner.id } });
  console.log('Store created:', store.name, store.id);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
