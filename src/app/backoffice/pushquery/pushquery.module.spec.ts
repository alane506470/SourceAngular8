import { PushqueryModule } from './pushquery.module';

describe('PushqueryModule', () => {
  let pushqueryModule: PushqueryModule;

  beforeEach(() => {
    pushqueryModule = new PushqueryModule();
  });

  it('should create an instance', () => {
    expect(pushqueryModule).toBeTruthy();
  });
});
