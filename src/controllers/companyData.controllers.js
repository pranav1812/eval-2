const cdServices = require('../services/companyData.services');
const saveSchema = require('../schemas/save');
const updateSchema = require('../schemas/update');

const saveCompanyData = async (req, res) => {
  try {
    const { error } = saveSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    // const { urlLink } = req.body;
    const urlLink = `${process.env.externalAPI}:4000/${req.body.urlLink}`;
    const toReturn = await cdServices.extractCompanyData(urlLink);
    return res.status(201).json(toReturn);
  } catch (error) {
    //
    console.log(`Error: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

const getSectorCompaniesOrderedByScore = async (req, res) => {
  try {
    const { sector } = req.query;
    if (!sector) {
      return res.status(400).json({ message: 'Sector is required' });
    }
    const orderedByScore = await cdServices.getSectorCompaniesOrderedByScore(
      sector
    );
    if (!orderedByScore.length) {
      return res
        .status(404)
        .json({ message: 'No companies found in this sector' });
    }
    return res.status(200).json(orderedByScore);
  } catch (error) {
    return res.status(500).json({
      error: `INTERNAL SERVER ERROR: ${error.message}`,
    });
  }
};

const updateCompanyData = async (req, res) => {
  try {
    const { compId } = req.params;
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { ...updateParams } = req.body;
    const toReturn = await cdServices.updateCompanyData(compId, updateParams);
    if (toReturn[0] === 0)
      return res.status(404).json({ message: 'Company Not found' });
    return res.status(201).json(toReturn);
  } catch (error) {
    //
    console.log(`Error: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveCompanyData,
  getSectorCompaniesOrderedByScore,
  updateCompanyData,
};
