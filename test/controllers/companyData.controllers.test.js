const COMPANY_DATA_CONTROLLERS = require('../../src/controllers/companyData.controllers');

const cdServices = require('../../src/services/companyData.services');

describe('COMPANY_DATA_CONTROLLERS', () => {
  describe('/saveCompanyData', () => {
    it('should give 400 response upon sending badly formed requests', async () => {
      const req = {
        body: {
          urlLink: 'https://store-0001.s3.amazonaws.com/input.js',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await COMPANY_DATA_CONTROLLERS.saveCompanyData(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should give 201 response along with an array of rows created in the database', async () => {
      const req = {
        body: {
          urlLink: 'https://store-0001.s3.amazonaws.com/input.csv',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const serviceMockData = [
        {
          id: '95b5a067-808a-44a9-a490-b4ef8a045f61',
          name: 'Volkswagen',
          score: 15.784075000000001,
        },
        {
          id: '728ae3b7-89dd-41eb-9608-4fc20c839d4c',
          name: 'Mercedes',
          score: 18.481825,
        },
        {
          id: '46e1d061-e39d-4d5c-8e0e-3fa5d45d9efc',
          name: 'Apple',
          score: 29.987724999999998,
        },
        {
          id: '8727cc61-8c4b-4285-8853-2db808392c04',
          name: 'Google',
          score: 13.27365,
        },
      ];
      jest
        .spyOn(cdServices, 'extractCompanyData')
        .mockResolvedValue(serviceMockData);
      await COMPANY_DATA_CONTROLLERS.saveCompanyData(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(serviceMockData);
    });
  });

  describe('/getSectorCompaniesOrderedByScore', () => {
    it('should give 200 response along with an array of companies in the sector ordered by their score', async () => {
      const serviceMock = [
        {
          id: '46e1d061-e39d-4d5c-8e0e-3fa5d45d9efc',
          name: 'Apple',
          score: 29.987724999999998,
          ceo: 'Bobbie Volkman',
          ranking: 1,
        },
        {
          id: 'b6472c52-732a-4fd2-a463-ae604c0a2c79',
          name: 'Microsoft',
          score: 21.3221,
          ceo: 'Mr. Angie Quigley',
          ranking: 2,
        },
      ];
      jest
        .spyOn(cdServices, 'getSectorCompaniesOrderedByScore')
        .mockResolvedValue(serviceMock);
      const req = {
        query: {
          sector: 'Software',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await COMPANY_DATA_CONTROLLERS.getSectorCompaniesOrderedByScore(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(serviceMock);
    });
    it('should give 404 response along with an array of companies in the sector ordered by their score', async () => {
      const serviceMock = [];
      jest
        .spyOn(cdServices, 'getSectorCompaniesOrderedByScore')
        .mockResolvedValue(serviceMock);
      const req = {
        query: {
          sector: 'Software',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await COMPANY_DATA_CONTROLLERS.getSectorCompaniesOrderedByScore(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('/updateCompanyData', () => {
    it('should throw 400 when un allowed fields are passed', async () => {
      const req = {
        params: {
          compId: '46e1d061-e39d-4d5c-8e0e-3fa5d45d9efc',
        },
        body: {
          name: 'Apple',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await COMPANY_DATA_CONTROLLERS.updateCompanyData(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it('should throw 404 when no company is found', async () => {
      jest.spyOn(cdServices, 'updateCompanyData').mockResolvedValue([0]);
      const req = {
        params: {
          compId: '46e1d061-e39d-4d5c-8e0e-3fa5d45d9efc',
        },
        body: {
          ceo: 'Bobbie Volkman',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await COMPANY_DATA_CONTROLLERS.updateCompanyData(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
    it('should throw 201 when no company is found', async () => {
      jest.spyOn(cdServices, 'updateCompanyData').mockResolvedValue([1]);
      const req = {
        params: {
          compId: '46e1d061-e39d-4d5c-8e0e-3fa5d45d9efc',
        },
        body: {
          ceo: 'Bobbie Volkman',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await COMPANY_DATA_CONTROLLERS.updateCompanyData(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith([1]);
    });
  });
});
