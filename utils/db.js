const Sequelize = require('sequelize')
const { DATABASE_URL, TEST_DATABASE_URL, TESTING } = require('./config')

const databaseUrl = TESTING
  ? TEST_DATABASE_URL
  : DATABASE_URL


const sequelize = new Sequelize(databaseUrl, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected')
  } catch (error) {
    console.log('Connecting to database failed')
    return process.exit(1)
  }
}

module.exports = { sequelize, connectToDatabase }
