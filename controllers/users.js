const router = require('express').Router()

const { User, Blog, ReadingList } = require('../models')
const { errorHandler } = require('../utils/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      as: 'blogs',
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
  const read = req.query.read
  if (read !== undefined && read !== 'true' && read !== 'false') {
    return res.status(400).json({ error: 'read must be true or false' })
  }

  const readingListInclude = {
    model: ReadingList,
    as: 'readingListEntries',
    attributes: ['id', 'read'],
    required: false,
    include: {
      model: Blog,
      as: 'blog',
      attributes: ['id', 'url', 'title', 'author', 'likes', 'year']
    }
  }

  if (read !== undefined) {
    readingListInclude.where = { read: read === 'true' }
  }

  const user = await User.findByPk(req.params.id, {
    include: readingListInclude
  })
  if (user) {
    const userData = user.toJSON()
    userData.readings = userData.readingListEntries.map(({ id, read, blog }) => ({
      ...blog,
      readingList: { id, read }
    }))
    delete userData.readingListEntries
    res.json(userData)
  } else {
    res.status(404).end()
  }
})

router.use(errorHandler)

module.exports = router