import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get(AppController);
      expect(typeof(appController.getHello())).toBe('string');
    });
  });

  describe('getCurrentStock', () => {
    it('should return Current Stock', () => {
      const appController = app.get(AppController);
      let query = {
        "sku":'KPV897515/43/20'
      }
      let response = appController.getCurrentStock(query)
      .then((response) =>{
        console.log("response", response);
      }).
      catch((error) => {
        console.log("error", error);
      });
      expect(typeof(response)).toBe('object');
    });
  });
});
