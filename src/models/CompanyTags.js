const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CompanyTags extends Model {
    static associate(models) {
      // belongs to one company
      CompanyTags.belongsTo(models.Companies, {
        foreignKey: 'companyId',
        onDelete: 'CASCADE',
      });
      // belongs to one tag
      CompanyTags.belongsTo(models.Tags, {
        foreignKey: 'tagId',
        onDelete: 'CASCADE',
      });
    }
  }
  CompanyTags.init(
    {
      companyId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      tagId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'CompanyTags',
    }
  );
  return CompanyTags;
};
