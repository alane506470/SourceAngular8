import { PreviewPicModule } from './preview-pic.module';

describe('PreviewPicModule', () => {
  let previewPicModule: PreviewPicModule;

  beforeEach(() => {
    previewPicModule = new PreviewPicModule();
  });

  it('should create an instance', () => {
    expect(previewPicModule).toBeTruthy();
  });
});
