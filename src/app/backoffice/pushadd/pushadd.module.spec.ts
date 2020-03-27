import { PushaddModule } from './pushadd.module';

describe('PushaddModule', () => {
  let pushaddModule: PushaddModule;

  beforeEach(() => {
    pushaddModule = new PushaddModule();
  });

  it('should create an instance', () => {
    expect(pushaddModule).toBeTruthy();
  });
});
