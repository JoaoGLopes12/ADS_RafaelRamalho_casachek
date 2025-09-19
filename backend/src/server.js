import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import gastosRoute from "./routes/gastosRoute.js";

dotenv.config();

const app = express();

app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;


app.use("/api/gastos", gastosRoute);

// Inicializa o servidor após o DB estar pronto
initDB().then(() => {
  app.listen(PORT, () => {
    console.log("O servidor está rodando na PORTA:", PORT);
  });
});