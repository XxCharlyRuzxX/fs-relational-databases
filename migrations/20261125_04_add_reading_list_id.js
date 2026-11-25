const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('reading_lists', 'reading_lists_pkey')
    await queryInterface.addColumn('reading_lists', 'id', {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    })
    await queryInterface.addConstraint('reading_lists', {
      fields: ['user_id', 'blog_id'],
      type: 'unique',
      name: 'reading_lists_user_id_blog_id_unique'
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('reading_lists', 'reading_lists_user_id_blog_id_unique')
    await queryInterface.removeColumn('reading_lists', 'id')
    await queryInterface.addConstraint('reading_lists', {
      fields: ['user_id', 'blog_id'],
      type: 'primary key',
      name: 'reading_lists_pkey'
    })
  }
}
