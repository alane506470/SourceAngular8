import { AppDownloadFromBranchModule } from './app-download-from-branch.module';

describe('AppDownloadFromBranchModule', () => {
  let appDownloadFromBranchModule: AppDownloadFromBranchModule;

  beforeEach(() => {
    appDownloadFromBranchModule = new AppDownloadFromBranchModule();
  });

  it('should create an instance', () => {
    expect(appDownloadFromBranchModule).toBeTruthy();
  });
});
