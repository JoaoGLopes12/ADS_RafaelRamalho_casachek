import express from "express";
import {
  createGastos,
  getGastosByUserId,
  deleteGastos,
  getSummaryByUserId
} from "../controllers/gastosController.js"; // corrigido o caminho

const router = express.Router();

// Rotas mais específicas primeiro
router.get("/summary/:userId", getSummaryByUserId); // padronizei para minúsculas

// Rotas gerais
router.get("/:userId", getGastosByUserId);
router.post("/", createGastos);
router.delete("/:id", deleteGastos);

export default router;