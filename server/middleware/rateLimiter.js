const requests = new Map();

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = req.path.includes('/emergency') ? 10 : 100; // Lower limit for emergency endpoints

  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  const userRequests = requests.get(ip);
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
  requests.set(ip, validRequests);

  if (validRequests.length >= maxRequests) {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(windowMs / 1000),
      limit: maxRequests,
      windowMs
    });
  }

  // Add current request
  validRequests.push(now);
  requests.set(ip, validRequests);

  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': maxRequests,
    'X-RateLimit-Remaining': maxRequests - validRequests.length,
    'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
  });

  next();
};