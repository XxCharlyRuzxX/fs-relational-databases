const router = require('express').Router()

const { errorHandler, tokenExtractor } = require('../utils/middleware')

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    await req.authSession.destroy()
    return res.status(204).end()
  } catch (error) {
    return next(error)
  }
})

router.use(errorHandler)

module.exports = router
