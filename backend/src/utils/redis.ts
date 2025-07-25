import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Criar cliente Redis apenas se a URL estiver configurada
let redis: any = null;

try {
  redis = createClient({ url: redisUrl });
  redis.on('error', (err: any) => {
    console.warn('Redis não disponível, sistema funcionará sem cache:', err.message);
    redis = null;
  });

  (async () => {
    try {
      if (redis && !redis.isOpen) {
        await redis.connect();
        console.log('Redis conectado com sucesso');
      }
    } catch (error) {
      console.warn('Redis não disponível, sistema funcionará sem cache');
      redis = null;
    }
  })();
} catch (error) {
  console.warn('Redis não configurado, sistema funcionará sem cache');
  redis = null;
}

export { redis };
