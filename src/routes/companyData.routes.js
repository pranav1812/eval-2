const express = require('express');
const CD_CONTROLLERS = require('../controllers/companyData.controllers');

const router = express.Router();

router.post('/save', CD_CONTROLLERS.saveCompanyData);

module.exports = router;
