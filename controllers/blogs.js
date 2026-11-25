const router = require('express').Router()
const {Blog , User} = require('../models')
const { Op } = require('sequelize')
const { errorHandler, tokenExtractor } = require('../utils/middleware')


const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/', async (req, res) => {
  const where = {}
  const search = req.query.search

  if (typeof search === 'string' && search.length > 0) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } }
    ]
  }
 const blogs = await Blog.findAll({
  attributes: { exclude: ['userId'] },
    include: {
      model: User,
    as: 'user',
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
 })
  res.json(blogs)
})


router.post('/', tokenExtractor , async (req, res, next) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      userId: req.decodedToken.id
    })
    res.json(blog)
  } catch(error) {
    error.status = 400
    next(error)
  }
})


router.get('/:id', blogFinder , async (req, res) => {
    res.json(req.blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'only the user who created this blog can delete it' })
  }

  await req.blog.destroy()
  res.status(204).end()
})

router.put('/:id', blogFinder , async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch(error) {
    error.status = 400
    next(error)
  }
})

router.use(errorHandler)

module.exports = router

