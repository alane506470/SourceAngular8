import { FdsCommunitymgmtModule } from './fds-communitymgmt.module';

describe('FdsCommunitymgmtModule', () => {
  let fdsCommunitymgmtModule: FdsCommunitymgmtModule;

  beforeEach(() => {
    fdsCommunitymgmtModule = new FdsCommunitymgmtModule();
  });

  it('should create an instance', () => {
    expect(fdsCommunitymgmtModule).toBeTruthy();
  });
});
