import { BonusaddModule } from './bonusadd.module';

describe('BonusaddModule', () => {
  let bonusaddModule: BonusaddModule;

  beforeEach(() => {
    bonusaddModule = new BonusaddModule();
  });

  it('should create an instance', () => {
    expect(bonusaddModule).toBeTruthy();
  });
});
