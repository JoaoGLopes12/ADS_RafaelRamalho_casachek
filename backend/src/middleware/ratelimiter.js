import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Cria conexão com Redis (dados vêm do .env)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Cria instância do RateLimiter
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(6, "60 s"), // até 10 requisições a cada 10 segundos por IP
  analytics: true,
});

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit(req.ip);

    if (!success) {
      return res.status(429).json({
        message: "Muitos requests, aguarde alguns instantes para tentar novamente.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
