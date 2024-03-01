import { sql } from "@/data";

export async function GET(res) {
  const customers = await sql`SELECT * FROM customers`;
  return Response.json(customers);
}
