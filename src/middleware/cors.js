export function corsMiddleware(req, res, next) {
  const origin1 = process.env.CORS_ORIGIN_1 || "";
  const origin2 = process.env.CORS_ORIGIN_2 || "";
  const whitelist = [origin1, origin2].filter(Boolean);

  const origin = req.headers.origin;

  if (origin && whitelist.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");


  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
}
