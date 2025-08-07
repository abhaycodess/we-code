// middleware/restrictTo.js

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is attached to the request (already done by 'protect' middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.userType)) {
      return res.status(403).json({ message: 'Access denied for this role.' });
    }

    next();
  };
};

export default restrictTo;
