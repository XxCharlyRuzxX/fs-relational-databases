const router = require('express').Router()

const { Blog, User, ReadingList, Session } = require('../models')
const { sequelize } = require('../utils/db')
const { errorHandler } = require('../utils/middleware')

router.post('/', async (req, res, next) => {
  try {
    await sequelize.transaction(async transaction => {
      await ReadingList.destroy({ where: {}, transaction })
      await Session.destroy({ where: {}, transaction })
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
