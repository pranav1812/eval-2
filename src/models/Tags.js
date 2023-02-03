const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    static associate(models) {
      // belongs to many companies (through CompanyTags)
      Tags.belongsToMany(models.Companies, {
        through: 'CompanyTags',
        as: 'companies',
        foreignKey: 'tagId',
      });
    }
  }
  Tags.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'Tags',
    }
  );
  return Tags;
};
