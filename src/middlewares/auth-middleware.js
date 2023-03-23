const passport = require('passport');
const db = require('../db/pool');

exports.userAuth = passport.authenticate('jwt', { session: false });

exports.adminAuth = async (req, res, next) => {
  try {
    const user = req.user;
    console.log('User in adminAuth:', user);

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    console.log('Error in adminAuth:', error);
    return res.status(500).json({ error: error.message });
  }
};

exports.adminOrRenterAuth = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role === "admin" || user.role === "renter") {
      return next(); // Agrega 'return' aquí
    } else {
      return res.status(403).json({ error: "Acceso denegado: se requiere ser admin o renter." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error en la autenticación de admin o renter." });
  }
};
