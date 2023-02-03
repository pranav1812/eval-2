const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BadAll extends Model {
    //
  }
  BadAll.init(
    {
      compId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      ceo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: null,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      score: {
        // float
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      sector: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      sequelize,
      modelName: 'BadAll',
      timestamps: false,
    }
  );
  return BadAll;
};
