const { BadAll } = require('../models');

const saveToDatabase = async (data) => {
  console.log('saving to DB', data);
  const dbRes = await BadAll.bulkCreate(data);
  console.log('saved to DB', dbRes);
};

const getSectorCompaniesOrderedByScore = async (sector) => {
  const companies = await BadAll.findAll({
    where: {
      sector,
    },
    order: [['score', 'DESC']],
  });
  const toReturn = companies.map((company, ind) => ({
    ...company.dataValues,
    rank: ind + 1,
  }));
  return toReturn;
};

module.exports = { saveToDatabase, getSectorCompaniesOrderedByScore };
