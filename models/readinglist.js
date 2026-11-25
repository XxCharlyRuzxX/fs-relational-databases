
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class ReadingList extends Model {}

ReadingList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'reading_list',
  tableName: 'reading_lists',
  indexes: [{
    unique: true,
    fields: ['user_id', 'blog_id']
  }]
})

module.exports = ReadingList
