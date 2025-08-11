exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role || 'USER'; // role comes from decoded JWT

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: Access Denied' });
    }

    next();
  };
};
