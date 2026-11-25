const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session, User } = require('../models')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  const status = error.status || error.statusCode || 500
  const messages = error.errors
    ? error.errors.map(validationError => validationError.message)
    : error.message

  response.status(status).json({ error: messages })
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (!SECRET) {
    return res.status(500).json({ error: 'JWT secret is not configured' })
  }

  let token
  let decodedToken
  if (authorization?.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
    try {
      decodedToken = jwt.verify(token, SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  try {
    const session = await Session.findOne({ where: { token } })
    if (!session || session.userId !== decodedToken.id) {
      return res.status(401).json({ error: 'session is no longer valid' })
    }

    const user = await User.findByPk(decodedToken.id)
    if (!user || user.disabled) {
      if (session) {
        await session.destroy()
      }
      return res.status(401).json({ error: 'user is disabled or no longer exists' })
    }

    req.decodedToken = decodedToken
    req.authSession = session
    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = { errorHandler, tokenExtractor }
