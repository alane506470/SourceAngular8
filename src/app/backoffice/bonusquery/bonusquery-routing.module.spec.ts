import { BonusqueryRoutingModule } from './bonusquery-routing.module';

describe('BonusqueryRoutingModule', () => {
  let bonusqueryRoutingModule: BonusqueryRoutingModule;

  beforeEach(() => {
    bonusqueryRoutingModule = new BonusqueryRoutingModule();
  });

  it('should create an instance', () => {
    expect(bonusqueryRoutingModule).toBeTruthy();
  });
});
