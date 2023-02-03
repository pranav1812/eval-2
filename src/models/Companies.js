const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Companies extends Model {
    static associate(models) {
      // belongs to one sector, sector has many companies
      Companies.belongsTo(models.Sectors, {
        foreignKey: 'sector',
        onDelete: 'CASCADE',
      });
      // belongs to many tags (through CompanyTags)
      Companies.belongsToMany(models.Tags, {
        through: 'CompanyTags',
        as: 'tags',
        foreignKey: 'companyId',
      });
    }
  }
  Companies.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
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
      sector: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Companies',
    }
  );
  return Companies;
};
