function ensureAdmin(req, res, next) {
  const isAdmin = req.user && req.user.username === 'admin';
  if (isAdmin) return next();

  res.status(401).json({ error: 'Unauthorized' });
}

module.exports = ensureAdmin;
