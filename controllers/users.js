const router = require('express').Router()

const { User, Blog } = require('../models')
const { errorHandler } = require('../utils/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }

  }
  )
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name } = req.body || {}
    const user = await User.create({ username, name })
    res.json(user)
  } catch (error) {
    error.status = 400
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username }
    })

    if (!user) {
      return res.status(404).end()
    }

    const { name } = req.body || {}
    await user.update({ name })
    return res.json(user)
  } catch (error) {
    error.status = 400
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.use(errorHandler)

module.exports = router