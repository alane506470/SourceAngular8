import { BonusMgtModule } from './bonus-mgt.module';

describe('BonusMgtModule', () => {
  let bonusMgtModule: BonusMgtModule;

  beforeEach(() => {
    bonusMgtModule = new BonusMgtModule();
  });

  it('should create an instance', () => {
    expect(bonusMgtModule).toBeTruthy();
  });
});
