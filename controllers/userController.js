const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    // Restrict access to admins only
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'password', 'createdAt']
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
