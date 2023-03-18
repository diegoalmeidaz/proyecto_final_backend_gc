const passport = require('passport')
const { Strategy } = require('passport-jwt')
const { SECRET } = require('../constants/ports')
const db = require('../db/pool')

const cookieExtractor = function (req) {
  let token = null
  if (req && req.cookies) token = req.cookies['token']
  console.log("Extracted token:", token); // Agrega esta línea
  return token
}

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: cookieExtractor,
}

passport.use(
  'jwt',
  new Strategy(opts, async ({ id }, done) => {
    try {
      console.log('Decoded JWT:', { id });
      const { rows } = await db.query(
        'SELECT user_id, username, rol FROM users WHERE user_id = $1',
        [id]
      );

      console.log('Query result:', rows); // Agregue esta línea

      if (!rows.length) {
        throw new Error('401 not authorized');
      }

      let user = { id: rows[0].user_id, username: rows[0].username, rol: rows[0].rol };
      console.log('User object:', user); // Agregue esta línea

      return await done(null, user);
    } catch (error) {
      console.log(error.message);
      done(null, false);
    }
  })
);


