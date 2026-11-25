const router = require('express').Router()
const { fn, col } = require('sequelize')

const { Blog } = require('../models')
const { errorHandler } = require('../utils/middleware')

router.get('/', async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [fn('COUNT', col('id')), 'blogs'],
        [fn('SUM', col('likes')), 'likes']
      ],
      group: ['author'],
      order: [[fn('SUM', col('likes')), 'DESC']]
    })

    return res.json(authors)
  } catch (error) {
    return next(error)
  }
})

router.use(errorHandler)

module.exports = router
