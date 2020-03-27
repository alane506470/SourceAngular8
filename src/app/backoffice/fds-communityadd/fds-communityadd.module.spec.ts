import { FdsCommunityaddModule } from './fds-communityadd.module';

describe('FdsCommunityaddModule', () => {
  let fdsCommunityaddModule: FdsCommunityaddModule;

  beforeEach(() => {
    fdsCommunityaddModule = new FdsCommunityaddModule();
  });

  it('should create an instance', () => {
    expect(fdsCommunityaddModule).toBeTruthy();
  });
});
