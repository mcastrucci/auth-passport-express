const Sequelize = require('sequelize');
const db = require('./database.js');
const bcrypt = require("bcrypt");

class User extends Sequelize.Model {}

User.init(
  {
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'user',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
          const saltRounds = 10
          const salt = await bcrypt.genSalt(saltRounds)
          user.password = await bcrypt.hash(user.password, salt)
        }
    }
  }
)

User.prototype.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = User;
