import { ComfirmDialogModule } from './comfirm-dialog.module';

describe('ComfirmDialogModule', () => {
  let comfirmDialogModule: ComfirmDialogModule;

  beforeEach(() => {
    comfirmDialogModule = new ComfirmDialogModule();
  });

  it('should create an instance', () => {
    expect(comfirmDialogModule).toBeTruthy();
  });
});
