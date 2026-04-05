const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  // Handle 'Bearer ' prefix if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
