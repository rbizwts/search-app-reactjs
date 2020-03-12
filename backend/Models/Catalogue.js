const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = require('../Config/Database');

class Catalogue extends Model { }

Catalogue.init({
  // attributes
  category: {
    // ENUM - REFERENCES is not worlking
    type: Sequelize.ENUM('INFO', 'DEFINITION', 'OTHERDETAILS', 'PROJECTS', 'QUESTIONS', 'TEAM'),
    allowNull: false,
    defaultValue: 'INFO'
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    // allowNull defaults to true
  },
  tags: {
    type: Sequelize.STRING
  },
  isTagSearchOnly: {
    type: Sequelize.ENUM('YES', 'NO'),
    allowNull: false,
    defaultValue: 'NO'
  },
  status: {
    type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  }
}, {
  sequelize,
  modelName: 'catalogue',
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  // options
});

module.exports = Catalogue;