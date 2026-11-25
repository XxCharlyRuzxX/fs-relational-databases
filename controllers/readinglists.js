const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')
const { errorHandler, tokenExtractor } = require('../utils/middleware')

const isValidId = id => Number.isInteger(id) && id > 0

router.post('/', async (req, res, next) => {
  const { blogId, userId } = req.body || {}

  if (!isValidId(blogId)) {
    return res.status(400).json({ error: 'blogId must be a positive integer' })
  }

  if (!isValidId(userId)) {
    return res.status(400).json({ error: 'userId must be a positive integer' })
  }

  try {
    const blog = await Blog.findByPk(blogId)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const reading = await ReadingList.create({
      user_id: user.id,
      blog_id: blog.id
    })

    return res.status(201).json({
      id: reading.id,
      userId: reading.user_id,
      blogId: reading.blog_id,
      read: reading.read
    })
  } catch (error) {
    error.status = 400
    return next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id < 1) {
    return res.status(404).json({ error: 'Reading list entry not found' })
  }

  if (typeof req.body?.read !== 'boolean') {
    return res.status(400).json({ error: 'read must be a boolean' })
  }

  try {
    const reading = await ReadingList.findByPk(id)
    if (!reading) {
      return res.status(404).json({ error: 'Reading list entry not found' })
    }

    if (reading.user_id !== req.decodedToken.id) {
      return res.status(401).json({ error: 'not authorized to update this reading list entry' })
    }

    await reading.update({ read: req.body.read })
    return res.json({
      id: reading.id,
      userId: reading.user_id,
      blogId: reading.blog_id,
      read: reading.read
    })
  } catch (error) {
    return next(error)
  }
})

router.use(errorHandler)

module.exports = router