const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING(255)
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
  type: DataTypes.INTEGER,
  validate: {
    isInt: {
      msg: 'Year must be an integer'
    },
    min: {
      args: [1991],
      msg: 'Year should be at least 1991'
    },
    max: {
      args: [new Date().getFullYear()],
      msg: `Year should not be greater than ${new Date().getFullYear()}`
    }
  }
}
},{
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog'
})
module.exports = Blog