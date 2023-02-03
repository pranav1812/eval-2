const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sectors extends Model {
    static associate(models) {
      // has many companies, company has one sector
      Sectors.hasMany(models.Companies, {
        foreignKey: 'sectorId',
        as: 'companies',
      });
    }
  }
  Sectors.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'Sectors',
    }
  );
  return Sectors;
};
