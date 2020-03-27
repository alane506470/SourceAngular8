import { BonusqueryModule } from './bonusquery.module';

describe('BonusqueryModule', () => {
  let bonusqueryModule: BonusqueryModule;

  beforeEach(() => {
    bonusqueryModule = new BonusqueryModule();
  });

  it('should create an instance', () => {
    expect(bonusqueryModule).toBeTruthy();
  });
});
