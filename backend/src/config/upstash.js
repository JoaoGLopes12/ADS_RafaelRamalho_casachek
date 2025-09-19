import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import "dotenv/config";

// Conexão com Redis
const redis = Redis.fromEnv();

// Exemplo de uso do Ratelimit
const ratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(6, "60 s"), // 100 requisições a cada 60 segundos
});

export default ratelimiter;