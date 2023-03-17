const { check } = require('express-validator')
const db = require('../db/pool')
const { compare } = require('bcryptjs')
const express = require('express');
const router = express.Router();

router.get('/api', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * from users')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error del servidor')
  }
})


//password
const password = check('password')
  .isLength({ min: 6, max: 15 })
  .withMessage('Password has to be between 6 and 15 characters.')

//email
const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email.')

  const username = check('username')
  .isString()
  .withMessage('Please provide a write a valid Username.')

//check if email exists
const emailExists = check('email').custom(async (value) => {
  const { rows } = await db.query('SELECT * from users WHERE email = $1', [
    value,
  ])

  if (rows.length) {
    throw new Error('Email already exists.')
  }
})

//check if username exists
const usernameExists = check('username').custom(async (value) => {
  const { rows } = await db.query('SELECT * from users WHERE username = $1', [
    value,
  ])

  if (rows.length) {
    throw new Error('Username already exists.')
  }
})

//login validation
const loginFieldsCheck = check('username').custom(async (value, { req }) => {
  const user = await db.query('SELECT * from users WHERE username = $1', [value])

  if (!user.rows.length) {
    throw new Error('Username does not exists.')
  }

  const validPassword = await compare(req.body.password, user.rows[0].password)

  if (!validPassword) {
    throw new Error('Contraseña Incorrecta')
  }

  req.user = user.rows[0]
})

module.exports = {
  registerValidation: [username, email, password, usernameExists, emailExists],
  loginValidation: [loginFieldsCheck],
}
