const cdServices = require('../services/companyData.services');
const saveSchema = require('../schemas/save');

const saveCompanyData = async (req, res) => {
  try {
    const { error } = saveSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { urlLink } = req.body;
    const toReturn = await cdServices.extractCompanyData(urlLink);
    return res.status(200).json(toReturn);
  } catch (error) {
    //
    console.log(`Error: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveCompanyData,
};
