const express = require('express');

const router = express.Router();

router.use('/', require('./companyData.routes'));

module.exports = router;
