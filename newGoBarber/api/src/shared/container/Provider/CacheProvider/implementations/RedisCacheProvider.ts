import Redis, { Redis as RedisCliente } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../model/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisCliente;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recovery<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    // ira retornar todas as chaves comecados com esse prefixo
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = this.client.pipeline();
    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();
  }
}
