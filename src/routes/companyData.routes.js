const express = require('express');
const CD_CONTROLLERS = require('../controllers/companyData.controllers');

const router = express.Router();

router.post('/save', CD_CONTROLLERS.saveCompanyData);
router.get('/companies', CD_CONTROLLERS.getSectorCompaniesOrderedByScore);
router.put('/update/:compId', CD_CONTROLLERS.updateCompanyData);

module.exports = router;
