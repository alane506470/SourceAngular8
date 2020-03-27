import { FdsCommunityqueryModule } from './fds-communityquery.module';

describe('FdsCommunityqueryModule', () => {
  let fdsCommunityqueryModule: FdsCommunityqueryModule;

  beforeEach(() => {
    fdsCommunityqueryModule = new FdsCommunityqueryModule();
  });

  it('should create an instance', () => {
    expect(fdsCommunityqueryModule).toBeTruthy();
  });
});
