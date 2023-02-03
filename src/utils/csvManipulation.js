const extractCompanyListAsArrayOfObjects = (textCSV) => {
  const rows = textCSV.split('\n');
  const toReturn = rows.map((row) => {
    const [id, sector] = row.split(',');
    return {
      compId: id,
      sector,
    };
  });
  return toReturn.splice(1);
};

const calculateScore = (companyData) => {
  // score = ((cpi * 10) + (cf / 10000) + (mau * 10) + roic) / 4
  const { performanceIndex } = companyData;
  const cpi = performanceIndex.find((pi) => pi.key === 'cpi').value;
  const cf = performanceIndex.find((pi) => pi.key === 'cf').value;
  const mau = performanceIndex.find((pi) => pi.key === 'mau').value;
  const roic = performanceIndex.find((pi) => pi.key === 'roic').value;
  const score = (cpi * 10 + cf / 10000 + mau * 10 + roic) / 4;
  return {
    ...companyData,
    score,
  };
};

module.exports = {
  extractCompanyListAsArrayOfObjects,
  calculateScore,
};
