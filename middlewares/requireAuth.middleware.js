const logger = require('../services/logger.service')

async function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    res.status(401).end('Unauthorized!');
    logger.info('Unauthorized User Tried to Login')
    return;
  }
  next();
}

async function requireAdmin(req, res, next) {
  const user = req.session.user;
  if (!user.isAdmin) {
    res.status(401).end('Unauthorized! Not Admin!');
    logger.info('Unauthorized Admin')
    return;
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin
}
