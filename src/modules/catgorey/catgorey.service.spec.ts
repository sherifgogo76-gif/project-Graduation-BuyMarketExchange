import { Test, TestingModule } from '@nestjs/testing';
import { CatgoreyService } from './catgorey.service';

describe('CatgoreyService', () => {
  let service: CatgoreyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatgoreyService],
    }).compile();

    service = module.get<CatgoreyService>(CatgoreyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
