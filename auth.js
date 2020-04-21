const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

const autoCatch = require('./lib/auto-catch');

const jwtSecret = process.env.JWT_SECRET || 'mark it zero';
const adminPassword = process.env.ADMIN_PASSWORD || 'iamthewalrus';
const jwtOpts = { algorithm: 'HS256', expiresIn: '30d' };

passport.use(adminStrategy());

const authenticate = passport.authenticate('local', { session: false });

async function login(req, res, next) {
  const token = await sign({ username: req.user.username });
  res.cookie('jwt', token, { httpOnly: true });
  res.json({ success: true, token });
}

async function sign(payload) {
  return await jwt.sign(payload, jwtSecret, jwtOpts);
}

async function ensureAdmin(req, res, next) {
  const jwtString = req.headers.authoriztion || req.cookies.jwt;
  const payload = await verify(jwtString);
  if (payload.username === 'admin') {
    return next();
  }

  const err = new Error('Unauthorized');
  err.statusCode = 401;
  next(err);
}

async function verify(jwtString = '') {
  jwtString = jwtString.replace(/^Bearer /i, '');

  try {
    return await jwt.verify(jwtString, jwtSecret);
  } catch (e) {
    e.statusCode = 401;
    throw e;
  }
}

function adminStrategy() {
  return new Strategy((username, password, cb) => {
    const isAdmin = (username === 'admin') && (password === adminPassword);
    if (isAdmin) {
      cb(null, { username: 'admin' });
    }

    cb(null, false);
  })
}


module.exports = {
  login,
  authenticate,
  setMiddleware,
  ensureAdmin
}
