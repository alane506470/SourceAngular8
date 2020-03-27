import { FdsRepairqueryModule } from './fds-repairquery.module';

describe('FdsRepairqueryModule', () => {
  let fdsRepairqueryModule: FdsRepairqueryModule;

  beforeEach(() => {
    fdsRepairqueryModule = new FdsRepairqueryModule();
  });

  it('should create an instance', () => {
    expect(fdsRepairqueryModule).toBeTruthy();
  });
});
