import { createClient } from 'redis';

let redis: any = null;

if (process.env.REDIS_URL) {
  redis = createClient({
    url: process.env.REDIS_URL,
  });

  redis.on('error', (err: any) => {
    console.warn('Redis não disponível:', err.message);
    redis = null;
  });

  (async () => {
    try {
      if (redis && !redis.isOpen) {
        await redis.connect();
        console.log('✅ Redis conectado com sucesso');
      }
    } catch (error) {
      console.warn('Redis não disponível');
      redis = null;
    }
  })();
} else {
  console.warn('Redis não configurado');
}

export { redis };
