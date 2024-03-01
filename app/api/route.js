import postgres from 'postgres';

export async function GET(res) {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const customers = await sql`SELECT * FROM customers`;
  return Response.json(customers);
}