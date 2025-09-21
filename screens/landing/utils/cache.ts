export const createCache = () => {
  const cache = new Map();
  
  return {
    get: (key: string) => cache.get(key),
    set: (key: string, value: any, ttl: number = 300000) => {
      cache.set(key, {
        data: value,
        expiry: Date.now() + ttl
      });
    },
    isExpired: (key: string) => {
      const item = cache.get(key);
      return !item || Date.now() > item.expiry;
    },
    clear: (key: string) => cache.delete(key)
  };
};

export const cache = createCache();