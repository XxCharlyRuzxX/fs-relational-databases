const Blog = require('./blog')
const User = require('./users')
const ReadingList =require('./readinglist')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, {
  as: 'readings',
  through: ReadingList,
  foreignKey: 'user_id',
  otherKey: 'blog_id'
})

Blog.belongsToMany(User, {
  as: 'readingUsers',
  through: ReadingList,
  foreignKey: 'blog_id',
  otherKey: 'user_id'
})

User.hasMany(ReadingList, {
  as: 'readingListEntries',
  foreignKey: 'user_id'
})
ReadingList.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
})
Blog.hasMany(ReadingList, {
  as: 'readingListEntries',
  foreignKey: 'blog_id'
})
ReadingList.belongsTo(Blog, {
  as: 'blog',
  foreignKey: 'blog_id'
})

User.hasMany(Session, {
  as: 'sessions',
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})
Session.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId'
})

module.exports = {
  Blog,
  User,
  ReadingList,
  Session
}