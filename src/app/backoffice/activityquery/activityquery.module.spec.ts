import { ActivityqueryModule } from './activityquery.module';

describe('ActivityqueryModule', () => {
  let activityqueryModule: ActivityqueryModule;

  beforeEach(() => {
    activityqueryModule = new ActivityqueryModule();
  });

  it('should create an instance', () => {
    expect(activityqueryModule).toBeTruthy();
  });
});
