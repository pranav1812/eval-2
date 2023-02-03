const express = require('express');
const cors = require('cors');

const { PORT } = require('./utils/config');
const router = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./utils/globals');

app.get('/', (req, res) => {
  res.status(200).send('Express Server Up and Running');
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
