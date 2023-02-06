const UTILS = require('../../src/utils/csvManipulation');

describe('csvManipulation.js', () => {
  describe('extractCompanyListAsArrayOfObjects', () => {
    it('should return an array of objects', () => {
      const csvData = `company_id,company_sector
95b5a067-808a-44a9-a490-b4ef8a045f61,Automobile
46e1d061-e39d-4d5c-8e0e-3fa5d45d9efc,Software
728ae3b7-89dd-41eb-9608-4fc20c839d4c,Automobile
8727cc61-8c4b-4285-8853-2db808392c04,Software
e90a7bc7-47fa-49af-bfa1-391fe7768b56,Software
b6472c52-732a-4fd2-a463-ae604c0a2c79,Software
ed4fc91d-8ac8-4882-a9e9-071a88423ca5,Retail
c144e397-bef9-4aa1-aef4-842f4da44f9c,Retail`;
      const expected = [
        {
          compId: '95b5a067-808a-44a9-a490-b4ef8a045f61',
          sector: 'Automobile',
        },
        {
          compId: '46e1d061-e39d-4d5c-8e0e-3fa5d45d9efc',
          sector: 'Software',
        },
        {
          compId: '728ae3b7-89dd-41eb-9608-4fc20c839d4c',
          sector: 'Automobile',
        },
        {
          compId: '8727cc61-8c4b-4285-8853-2db808392c04',
          sector: 'Software',
        },
        {
          compId: 'e90a7bc7-47fa-49af-bfa1-391fe7768b56',
          sector: 'Software',
        },
        {
          compId: 'b6472c52-732a-4fd2-a463-ae604c0a2c79',
          sector: 'Software',
        },
        {
          compId: 'ed4fc91d-8ac8-4882-a9e9-071a88423ca5',
          sector: 'Retail',
        },
        {
          compId: 'c144e397-bef9-4aa1-aef4-842f4da44f9c',
          sector: 'Retail',
        },
      ];
      const actual = UTILS.extractCompanyListAsArrayOfObjects(csvData);
      expect(actual).toEqual(expected);
    });
  });

  describe('calculateScore', () => {
    it('should return the same object with a new score parameter', () => {
      const input = {
        companyId: '95b5a067-808a-44a9-a490-b4ef8a045f61',
        performanceIndex: [
          { key: 'cpi', value: 0.46 },
          { key: 'cf', value: 523763 },
          { key: 'mau', value: 0.05 },
          { key: 'roic', value: 5.66 },
        ],
      };
      const expected = {
        companyId: '95b5a067-808a-44a9-a490-b4ef8a045f61',
        performanceIndex: [
          { key: 'cpi', value: 0.46 },
          { key: 'cf', value: 523763 },
          { key: 'mau', value: 0.05 },
          { key: 'roic', value: 5.66 },
        ],
        // eslint-disable-next-line prettier/prettier
        score: ((0.46 * 10) + (523763 / 10000) + (0.05 * 10) + 5.66) / 4,
      };
      const actual = UTILS.calculateScore(input);
      expect(actual).toEqual(expected);
    });
  });
});
