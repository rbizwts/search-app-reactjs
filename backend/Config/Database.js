const Sequelize = require('sequelize');

const sequelize = new Sequelize('project_one', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// const sequelize = new Sequelize('wtshub_react-search-app', 'wtshub_react_sea', 'H,D!zXN#U+yj', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;