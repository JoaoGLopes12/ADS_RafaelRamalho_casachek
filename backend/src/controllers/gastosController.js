import { sql } from "../config/db.js";

// Buscar todos os gastos de um usuário
export async function getGastosByUserId(req, res) {
  try {
    const { userId } = req.params;

    const gastos = await sql`
      SELECT * 
      FROM gastos 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    return res.status(200).json({ success: true, data: gastos });
  } catch (error) {
    console.error("Erro ao obter transação:", error);
    return res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
}

// Criar um novo gasto
export async function createGastos(req, res) {
  try {
    const { descricao, quantia, categoria, user_id } = req.body;

    if (!descricao || !user_id || !categoria || quantia === undefined) {
      return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    const gastos = await sql`
      INSERT INTO gastos (user_id, descricao, categoria, quantia)
      VALUES (${user_id}, ${descricao}, ${categoria}, ${quantia})
      RETURNING *
    `;

    return res.status(201).json({ success: true, data: gastos[0] });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
}

// Deletar um gasto pelo ID
export async function deleteGastos(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const result = await sql`
      DELETE FROM gastos
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Transação não encontrada" });
    }

    return res.status(200).json({ success: true, message: "Transação deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
}

// Resumo (saldo, receitas, despesas) por usuário
export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const [balanceResult] = await sql`
      SELECT COALESCE(SUM(quantia), 0) as balance
      FROM gastos
      WHERE user_id = ${userId}
    `;

    const [incomeResult] = await sql`
      SELECT COALESCE(SUM(quantia), 0) as income
      FROM gastos
      WHERE user_id = ${userId} AND quantia > 0
    `;

    const [expensesResult] = await sql`
      SELECT COALESCE(SUM(quantia), 0) as expenses
      FROM gastos
      WHERE user_id = ${userId} AND quantia < 0
    `;

    return res.status(200).json({
      success: true,
      data: {
        balance: balanceResult.balance,
        income: incomeResult.income,
        expenses: expensesResult.expenses,
      }
    });
  } catch (error) {
    console.error("Erro ao receber o resumo:", error);
    return res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
}