import { Test, TestingModule } from '@nestjs/testing';
import { GlobalUtilityController } from './global-utility.controller';

describe('GlobalUtilityController', () => {
  let controller: GlobalUtilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalUtilityController],
    }).compile();

    controller = module.get<GlobalUtilityController>(GlobalUtilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
