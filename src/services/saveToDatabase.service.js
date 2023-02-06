const { BadAll } = require('../models');

const saveToDatabase = async (data) => {
  const dbRes = await BadAll.bulkCreate(data, {
    updateOnDuplicate: [
      'name',
      'sector',
      'score',
      'ceo',
      'description',
      'tags',
      'address',
    ],
  });
  return dbRes;
};

const getSectorCompaniesOrderedByScore = async (sector) => {
  const companies = await BadAll.findAll({
    where: {
      sector,
    },
    // get only compId as id
    attributes: [['compId', 'id'], 'name', 'score', 'ceo'],
    order: [['score', 'DESC']],
  });
  const toReturn = companies.map((company, ind) => ({
    ...company.dataValues,
    ranking: ind + 1,
  }));
  return toReturn;
};

const updateCompany = async (companyId, data) => {
  const dbRes = await BadAll.update(data, {
    where: {
      compId: companyId,
    },
  });
  return dbRes;
};

module.exports = {
  saveToDatabase,
  getSectorCompaniesOrderedByScore,
  updateCompany,
};
