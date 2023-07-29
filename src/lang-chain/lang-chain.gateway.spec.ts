import { Test, TestingModule } from '@nestjs/testing';
import { LangChainGateway } from './lang-chain.gateway';

describe('LangChainGateway', () => {
  let gateway: LangChainGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LangChainGateway],
    }).compile();

    gateway = module.get<LangChainGateway>(LangChainGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
