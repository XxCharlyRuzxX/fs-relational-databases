const express = require('express')
const app = express()
const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

const blogsRouter = require('./controllers/blogs')
const authorsRouter = require('./controllers/authors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const resetRouter = require('./controllers/reset')
const readinglistsRouter = require('./controllers/readinglists')

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('OK')
})

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/reset', resetRouter)
app.use('/api/readinglists', readinglistsRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()