import { AppMemberPreferModule } from './app-member-prefer.module';

describe('AppMemberPreferModule', () => {
  let appMemberPreferModule: AppMemberPreferModule;

  beforeEach(() => {
    appMemberPreferModule = new AppMemberPreferModule();
  });

  it('should create an instance', () => {
    expect(appMemberPreferModule).toBeTruthy();
  });
});
