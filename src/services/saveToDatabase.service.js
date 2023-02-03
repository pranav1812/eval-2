const { BadAll } = require('../models');

const saveToDatabase = async (data) => {
  console.log('saving to DB', data);
  const dbRes = await BadAll.bulkCreate(data);
  console.log('saved to DB', dbRes);
};

module.exports = { saveToDatabase };
