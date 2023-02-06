const axios = require('axios');
const COMPANY_DATA_SERVICES = require('../../src/services/companyData.services');
const DB_SERVICE = require('../../src/services/saveToDatabase.service');

describe('companyData.services.js', () => {
  describe('extractCompanyData', () => {
    // it(`should throw 'Service Error: Invalid link' when wrongly formed url is passed`, async () => {
    //   const urlLink = 'https://store-0001.s3.amazonaws.com/input.js';
    //   const res = COMPANY_DATA_SERVICES.extractCompanyData(urlLink);
    //   await expect(res).rejects.toThrow('Service Error: Invalid link');
    // });
    it('should return an array of objects representing the companies stored in DB with there scores', async () => {
      const urlLink = 'https://store-0001.s3.amazonaws.com/input.csv';
      const axiosMock1 = {
        status: 200,
        data: `company_id,company_sector
95b5a067-808a-44a9-a490-b4ef8a045f61,Automobile`,
      };
      const axiosMock2 = {
        status: 200,
        data: {
          id: '95b5a067-808a-44a9-a490-b4ef8a045f61',
          name: 'Volkswagen',
          description:
            'Corporis animi non itaque tenetur dolores consectetur dolorem. Aliquam recusandae molestias error nam. Facilis excepturi eos maxime. Delectus doloribus eius neque deleniti.',
          ceo: 'Cristina Auer',
          tags: [
            'collaborative',
            'collaborative',
            'e-business',
            'frictionless',
            'sticky',
            'global',
            'ubiquitous',
            'vertical',
            'wireless',
            'value-added',
          ],
        },
      };
      const axiosMock3 = {
        status: 200,
        data: [
          {
            companyId: '95b5a067-808a-44a9-a490-b4ef8a045f61',
            performanceIndex: [
              {
                key: 'cpi',
                value: 0.46,
              },
              {
                key: 'cf',
                value: 523763,
              },
              {
                key: 'mau',
                value: 0.05,
              },
              {
                key: 'roic',
                value: 5.66,
              },
            ],
          },
        ],
      };

      jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce(axiosMock1)
        .mockResolvedValueOnce(axiosMock2)
        .mockResolvedValueOnce(axiosMock3);
      // mock await DB_SERVICE.saveToDatabase to return true
      jest.spyOn(DB_SERVICE, 'saveToDatabase').mockResolvedValue(true);
      const expected = [
        {
          id: '95b5a067-808a-44a9-a490-b4ef8a045f61',
          name: 'Volkswagen',
          score: 15.784075000000001,
        },
      ];
      const res = await COMPANY_DATA_SERVICES.extractCompanyData(urlLink);
      expect(res).toEqual(expected);
    });
    it('should return an array of objects representing the companies stored in DB with there scores', async () => {
      const urlLink = 'https://store-0001.s3.amazonaws.com/input.csv';
      const axiosMock1 = {
        data: `company_id,company_sector
  95b5a067-808a-44a9-a490-b4ef8a045f61,Automobile`,
      };
      const axiosMock2 = {
        data: {
          id: '95b5a067-808a-44a9-a490-b4ef8a045f61',
          name: 'Volkswagen',
          description:
            'Corporis animi non itaque tenetur dolores consectetur dolorem. Aliquam recusandae molestias error nam. Facilis excepturi eos maxime. Delectus doloribus eius neque deleniti.',
          ceo: 'Cristina Auer',
          tags: [
            'collaborative',
            'collaborative',
            'e-business',
            'frictionless',
            'sticky',
            'global',
            'ubiquitous',
            'vertical',
            'wireless',
            'value-added',
          ],
        },
      };
      const axiosMock3 = {
        data: [
          {
            companyId: '95b5a067-808a-44a9-a490-b4ef8a045f61',
            performanceIndex: [
              {
                key: 'cpi',
                value: 0.46,
              },
              {
                key: 'cf',
                value: 523763,
              },
              {
                key: 'mau',
                value: 0.05,
              },
              {
                key: 'roic',
                value: 5.66,
              },
            ],
          },
        ],
      };

      jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce(axiosMock1)
        .mockResolvedValueOnce(axiosMock2)
        .mockResolvedValueOnce(axiosMock3);
      // mock await DB_SERVICE.saveToDatabase to return true
      jest.spyOn(DB_SERVICE, 'saveToDatabase').mockResolvedValue(true);

      const res = COMPANY_DATA_SERVICES.extractCompanyData(urlLink);
      await expect(res).rejects.toThrow('Service Error');
    });
  });

  describe('getSectorCompaniesOrderedByScore', () => {
    it('should return ordered list of companies by their score along with ranking', async () => {
      const dbMock = [
        {
          id: '46e1d061-e39d-4d5c-8e0e-3fa5d45d9efc',
          name: 'Apple',
          score: 29.987724999999998,
          ceo: 'Pranav',
          ranking: 1,
        },
        {
          id: 'b6472c52-732a-4fd2-a463-ae604c0a2c79',
          name: 'Microsoft',
          score: 21.3221,
          ceo: 'Fannie Ebert',
          ranking: 2,
        },
        {
          id: '8727cc61-8c4b-4285-8853-2db808392c04',
          name: 'Google',
          score: 13.27365,
          ceo: 'Thomas Gibson DDS',
          ranking: 3,
        },
        {
          id: 'e90a7bc7-47fa-49af-bfa1-391fe7768b56',
          name: 'Meta',
          score: 13.102174999999999,
          ceo: 'Russell Kris',
          ranking: 4,
        },
      ];
      jest
        .spyOn(DB_SERVICE, 'getSectorCompaniesOrderedByScore')
        .mockResolvedValue(dbMock);
      const expected = [...dbMock];
      const res = await COMPANY_DATA_SERVICES.getSectorCompaniesOrderedByScore(
        'Automobile'
      );
      expect(res).toEqual(expected);
    });
  });

  describe('updateCompanyData', () => {
    it('should return an array containing only one element denoting the number of table rows updated', async () => {
      jest.spyOn(DB_SERVICE, 'updateCompany').mockResolvedValue([1]);
      const expected = [1];
      const res = await COMPANY_DATA_SERVICES.updateCompanyData(
        '95b5a067-808a-44a9-a490-b4ef8a045f61',
        { ceo: 'Jo meri eval le rha hai' }
      );
      expect(res).toEqual(expected);
    });
  });
});
