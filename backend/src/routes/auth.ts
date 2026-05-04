import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const registerSchema = z.object({
  name: z.string().min(2, 'Invalid input: Name too short'),
  email: z.string().email('Invalid input: Must be a valid email'),
  password: z.string().min(6, 'Invalid input: Password too short'),
  role: z.enum(['OWNER', 'MANAGER', 'STAFF']).optional(),
  storeId: z.string().uuid().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid input'),
  password: z.string().min(1, 'Invalid input')
});

router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role, storeId } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Invalid input: User already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || 'STAFF', storeId }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    res.status(400).json({ error: error.errors || 'Invalid input' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid input: Invalid credentials' });

    // Verify hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, storeId: user.storeId }, JWT_SECRET, { expiresIn: '1d' });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error });
  }
});

export default router;
