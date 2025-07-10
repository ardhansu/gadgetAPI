const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied: No security clearance provided',
      message: 'This mission requires proper authentication'
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: verified.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Access denied: Invalid security clearance',
        message: 'Agent not found in IMF database'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Access denied: Invalid security clearance',
      message: 'Token verification failed'
    });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access denied: Authentication required',
        message: 'Please authenticate first'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied: Insufficient clearance level',
        message: 'Your clearance level is not sufficient for this operation'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};