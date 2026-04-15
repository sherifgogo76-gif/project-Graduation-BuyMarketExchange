import { Test, TestingModule } from '@nestjs/testing';
import { CatgoreyController } from './catgorey.controller';
import { CatgoreyService } from './catgorey.service';

describe('CatgoreyController', () => {
  let controller: CatgoreyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatgoreyController],
      providers: [CatgoreyService],
    }).compile();

    controller = module.get<CatgoreyController>(CatgoreyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
