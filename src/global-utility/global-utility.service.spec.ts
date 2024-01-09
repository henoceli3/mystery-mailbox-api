import { Test, TestingModule } from '@nestjs/testing';
import { GlobalUtilityService } from './global-utility.service';

describe('GlobalUtilityService', () => {
  let service: GlobalUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalUtilityService],
    }).compile();

    service = module.get<GlobalUtilityService>(GlobalUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
