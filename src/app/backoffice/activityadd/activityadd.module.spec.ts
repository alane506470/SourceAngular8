import { ActivityaddModule } from './activityadd.module';

describe('ActivityaddModule', () => {
  let activityaddModule: ActivityaddModule;

  beforeEach(() => {
    activityaddModule = new ActivityaddModule();
  });

  it('should create an instance', () => {
    expect(activityaddModule).toBeTruthy();
  });
});
