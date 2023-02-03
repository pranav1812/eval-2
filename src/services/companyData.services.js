/* eslint-disable node/no-unsupported-features/es-builtins */
const axios = require('axios');
const csvManipulation = require('../utils/csvManipulation');
const DB_SERVICE = require('./saveToDatabase.service');

const perCompanyHost = 'http://54.167.46.10/company';
const sectorDataExtractionHost = 'http://54.167.46.10/sector?name';

const extractCompanyData = async (urlLink) => {
  try {
    const toBeStoredInDb = [];
    const apiResponse = await axios.get(urlLink);
    const companySectorList =
      csvManipulation.extractCompanyListAsArrayOfObjects(apiResponse.data);
    console.log(companySectorList);

    const perCompanyDataPromise = companySectorList.map((company) => {
      const { compId } = company;
      return axios.get(`${perCompanyHost}/${compId}`);
    });
    const perCompanyDataResolved = await Promise.all(perCompanyDataPromise);
    const perCompanyData = perCompanyDataResolved.map((data) => data.data);
    console.log(perCompanyData);

    const compIdNameMap = {};
    const compCompleteMap = {};
    // ---------------------------------------------
    perCompanyData.forEach((comp) => {
      const { id, name, tags, ceo, description } = comp;
      compIdNameMap[id] = name;
      compCompleteMap[id] = {
        compId: id,
        name,
        tags,
        ceo,
        description,
      };
    });
    // ---------------------------------------------

    const sectorMetaMap = {};
    companySectorList.forEach((cs) => {
      const { compId, sector } = cs;
      if (!sectorMetaMap[sector]) {
        sectorMetaMap[sector] = {};
      }
    });

    console.log(sectorMetaMap);

    const sectorCompanyDataPromise = Object.keys(sectorMetaMap).map((sector) =>
      axios.get(`${sectorDataExtractionHost}=${sector}`)
    );

    const sectorCompanyDataResolved = await Promise.all(
      sectorCompanyDataPromise
    );

    const sectorCompanyData = sectorCompanyDataResolved.map((res, ind) =>
      res.status === 200
        ? { sector: companySectorList[ind].sector, resp: res.data }
        : {}
    );

    console.log(
      '\n\n\n',
      JSON.stringify(sectorCompanyData[0], null, 2),
      '\n\n\n'
    );

    const sectorCompanyDataWithScores = sectorCompanyData.map((sectorData) => {
      const { sector, resp } = sectorData;
      const forDb = [];
      if (resp.length > 0) {
        resp.forEach((cd) => {
          const { score } = csvManipulation.calculateScore(cd);
          if (compIdNameMap[cd.companyId]) {
            const name = compIdNameMap[cd.companyId];
            const { tags, ceo, description, address } =
              compCompleteMap[cd.companyId];
            toBeStoredInDb.push({
              compId: cd.companyId,
              name,
              address,
              ceo,
              description,
              score,
              sector,
              tags,
            });
          }
        });
      }
      const companyWithScore = resp.map((cd) =>
        csvManipulation.calculateScore(cd)
      );

      // toBeStoredInDb.push(forDb);
      return {
        sector,
        companyWithScore,
      };
    });
    await DB_SERVICE.saveToDatabase(toBeStoredInDb);

    console.log(JSON.stringify(sectorCompanyDataWithScores, null, 2));

    // const toReturn = [{id: compId, name: compName, score}]
    const toReturn = [];
    sectorCompanyDataWithScores.forEach((sec) => {
      const { companyWithScore: cws } = sec;
      cws.forEach((comp) => {
        toReturn.push({
          id: comp.companyId,
          name: compIdNameMap[comp.companyId],
          score: comp.score,
        });
      });
    });
    console.log(toReturn.length);
    return toReturn.filter((cmp) => cmp.name !== undefined);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw new Error(`Error: ${error.message}`);
  }
};

// extractCompanyData('https://store-0001.s3.amazonaws.com/input.csv').then(
//   (res) => console.log(res)
// );

module.exports = {
  extractCompanyData,
};
