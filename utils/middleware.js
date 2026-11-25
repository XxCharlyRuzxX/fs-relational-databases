const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  const status = error.status || error.statusCode || 500
  const messages = error.errors
    ? error.errors.map(validationError => validationError.message)
    : error.message

  response.status(status).json({ error: messages })
}

module.exports = { errorHandler }
