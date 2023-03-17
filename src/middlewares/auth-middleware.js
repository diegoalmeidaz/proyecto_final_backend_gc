const passport = require('passport');
const db = require('../db/pool');

exports.userAuth = passport.authenticate('jwt', { session: false });

exports.adminAuth = async (req, res, next) => {
    try {
      const user = req.user;
      console.log('User in adminAuth:', user); // Agrega esta línea
  
      if (user.rol !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      next();
    } catch (error) {
      console.log('Error in adminAuth:', error); // Agrega esta línea
      return res.status(500).json({ error: error.message });
    }
  };
  
