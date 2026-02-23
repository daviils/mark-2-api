import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('home', () => {
    it('should return name for home view', () => {
      expect(appController.home()).toEqual({ name: 'David' });
    });
  });

  describe('detail', () => {
    it('should return item details passing :id', () => {
      expect(appController.detail('42')).toEqual({
        item: {
          id: '42',
          title: 'Item 42',
          description: 'Detalhes do item 42.',
        },
      });
    });
  });
});
