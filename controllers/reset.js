const router = require('express').Router()

const { Blog, User } = require('../models')
const { sequelize } = require('../utils/db')
const { errorHandler } = require('../utils/middleware')

router.post('/', async (req, res, next) => {
  try {
    await sequelize.transaction(async transaction => {
      await Blog.destroy({ where: {}, transaction })
      await User.destroy({ where: {}, transaction })
    })

    return res.status(204).end()
  } catch (error) {
    return next(error)
  }
})

router.use(errorHandler)

module.exports = router
