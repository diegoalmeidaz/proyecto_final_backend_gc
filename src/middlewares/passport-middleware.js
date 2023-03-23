const passport = require('passport')
const { Strategy } = require('passport-jwt')
const { SECRET } = require('../constants/ports')
const db = require('../db/pool')

const cookieExtractor = function (req) {
  let token = null
  if (req && req.cookies) token = req.cookies['token']
  // console.log("Extracted token:", token); 
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
        `
        SELECT users.user_id, users.username, roles.role_name 
        FROM users 
        INNER JOIN user_roles ON users.user_id = user_roles.user_id 
        INNER JOIN roles ON user_roles.role_id = roles.role_id 
        WHERE users.user_id = $1
        `,
        [id]
      );

      console.log('Query result:', rows);

      if (!rows.length) {
        throw new Error('401 not authorized');
      }

      let user = { id: rows[0].user_id, username: rows[0].username, role: rows[0].role_name };

      console.log('User object:', user);

      return await done(null, user);
    } catch (error) {
      console.log(error.message);
      done(null, false);
    }
  })
);
