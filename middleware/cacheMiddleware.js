const cache = new Map();
const TTL_MS = 60 * 1000;

const cacheMiddleware = (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl || req.url;
  const cached = cache.get(key);
  const now = Date.now();

  if (cached) {
    const isExpired = (now - cached.createdAt) >= TTL_MS;
    if (!isExpired) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached.data);
    } else {
      cache.delete(key);
    }
  }

  res.setHeader('X-Cache', 'MISS');

  const originalSend = res.send.bind(res);
  let isCaptured = false;

  res.send = function (body) {
    if (!isCaptured && res.statusCode >= 200 && res.statusCode < 300) {
      isCaptured = true;
      let dataToCache = body;
      if (typeof body === 'string') {
        try {
          dataToCache = JSON.parse(body);
        } catch (e) {
          dataToCache = body;
        }
      }
      cache.set(key, {
        data: dataToCache,
        createdAt: Date.now()
      });
    }
    return originalSend(body);
  };

  next();
};

const invalidateCacheMiddleware = (req, res, next) => {
  res.on('finish', () => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        clearCache();
      }
    }
  });
  next();
};

const clearCache = () => {
  cache.clear();
};

const getCache = () => cache;

module.exports = {
  cacheMiddleware,
  invalidateCacheMiddleware,
  clearCache,
  getCache
};
