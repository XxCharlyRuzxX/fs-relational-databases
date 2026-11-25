const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../utils/config')
const User = require('../models/users')

router.post('/', async (request, response) => {
  const body = request.body || {}

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  if (!user) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (!SECRET) {
    return response.status(500).json({ error: 'JWT secret is not configured' })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET)

  return response
    .status(200)
    .json({ token, username: user.username, name: user.name })
})

module.exports = router