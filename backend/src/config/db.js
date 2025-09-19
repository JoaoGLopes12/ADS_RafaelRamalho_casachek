import { neon } from "@neondatabase/serverless";

import "dotenv/config";

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS gastos(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(150) NOT NULL,
        categoria VARCHAR(150) NOT NULL,
        quantia DECIMAL(10,2) NOT NULL,
        descricao VARCHAR(150) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;

    console.log("Database iniciada");
  } catch (error) {
    console.error("Erro de inicialização:", error);
    process.exit(1);
  }
}