import { BonusaddRoutingModule } from './bonusadd-routing.module';

describe('BonusaddRoutingModule', () => {
  let bonusaddRoutingModule: BonusaddRoutingModule;

  beforeEach(() => {
    bonusaddRoutingModule = new BonusaddRoutingModule();
  });

  it('should create an instance', () => {
    expect(bonusaddRoutingModule).toBeTruthy();
  });
});
