import { EdmMgtModule } from './edm-mgt.module';

describe('EdmMgtModule', () => {
  let edmMgtModule: EdmMgtModule;

  beforeEach(() => {
    edmMgtModule = new EdmMgtModule();
  });

  it('should create an instance', () => {
    expect(edmMgtModule).toBeTruthy();
  });
});
