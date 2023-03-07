/* eslint-disable node/no-unsupported-features/es-builtins */
const axios = require('axios');
const csvManipulation = require('../utils/csvManipulation');
const DB_SERVICE = require('./saveToDatabase.service');

const externalHost = `${process.env.externalAPI}:4000`;
const perCompanyHost = `${externalHost}/company`;
const sectorDataExtractionHost = `${externalHost}/sector?name`;

const extractCompanyData = async (urlLink) => {
  try {
    const toBeStoredInDb = [];
    const apiResponse = await axios.get(urlLink);
    const companySectorList =
      csvManipulation.extractCompanyListAsArrayOfObjects(apiResponse.data);

    const perCompanyDataPromise = companySectorList.map((company) => {
      const { compId } = company;
      return axios.get(`${perCompanyHost}/${compId}`);
    });
    const perCompanyDataResolved = await Promise.all(perCompanyDataPromise);
    const perCompanyData = perCompanyDataResolved.map((data) => data.data);

    const compIdNameMap = {};
    const compCompleteMap = {};
    // ---------------------------------------------
    perCompanyData.forEach((comp, ind) => {
      const { id, name, tags, ceo, description } = comp;
      compIdNameMap[id] = name;
      compCompleteMap[id] = {
        compId: id,
        name,
        tags,
        ceo,
        description,
        sector: companySectorList[ind].sector,
      };
    });
    // ---------------------------------------------

    const sectorMetaMap = {}; // using hashmap as there is no hashmap implementation in Javascript
    companySectorList.forEach((cs) => {
      const { compId, sector } = cs;
      if (!sectorMetaMap[sector]) {
        sectorMetaMap[sector] = {};
      }
    });

    const sectorCompanyDataPromise = Object.keys(sectorMetaMap).map((sector) =>
      axios.get(`${sectorDataExtractionHost}=${sector}`)
    );

    const sectorCompanyDataResolved = await Promise.all(
      sectorCompanyDataPromise
    );

    const sectorCompanyData = sectorCompanyDataResolved.map((res, ind) =>
      res.status === 200
        ? { sector: Object.keys(sectorMetaMap)[ind], resp: res.data } // Object.keys(sectorMetaMap)[ind]
        : {}
    );

    const sectorCompanyDataWithScores = sectorCompanyData.map((sectorData) => {
      const { sector, resp } = sectorData;
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

      return {
        sector,
        companyWithScore,
      };
    });
    await DB_SERVICE.saveToDatabase(toBeStoredInDb);

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

    return toReturn.filter((cmp) => cmp.name !== undefined);
  } catch (error) {
    console.error(error);
    throw new Error(`Service Error: ${error.message}`);
  }
};

const getSectorCompaniesOrderedByScore = async (sector) => {
  const orderedByScore = await DB_SERVICE.getSectorCompaniesOrderedByScore(
    sector
  );
  return orderedByScore;
};

const updateCompanyData = async (compId, newParams) => {
  const updatedCompany = await DB_SERVICE.updateCompany(compId, newParams);
  return updatedCompany;
};

module.exports = {
  extractCompanyData,
  getSectorCompaniesOrderedByScore,
  updateCompanyData,
};
