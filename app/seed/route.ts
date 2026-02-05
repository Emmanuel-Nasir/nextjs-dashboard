// app/seed/route.ts
import postgres from 'postgres';
import bcrypt from 'bcryptjs'; // install if missing: npm add bcryptjs
import { customers, invoices, revenue, users } from '@/app/lib/placeholder-data'; // adjust path if needed

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // Create tables
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        customer_id UUID REFERENCES customers(id),
        amount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) PRIMARY KEY,
        revenue INT NOT NULL
      );
    `;

    // Seed users with hashed passwords
    const insertedUsers = await Promise.all(
      users.map(async (user: typeof users[number]) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return sql`
          INSERT INTO users (name, email, password)
          VALUES (${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (email) DO NOTHING;
        `;
      })
    );

    // Seed customers
    await Promise.all(
      customers.map((customer: typeof customers[number]) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT DO NOTHING;
      `)
    );

    // Seed invoices & revenue similarly (add these blocks from placeholder-data)
    // For brevity: copy the full logic from https://github.com/vercel/next-learn/blob/main/dashboard/app/seed/route.ts if needed

    return new Response(JSON.stringify({ message: 'Database seeded successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to seed database' }), { status: 500 });
  }
}
