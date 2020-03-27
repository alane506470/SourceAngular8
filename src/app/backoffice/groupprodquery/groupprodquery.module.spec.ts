import { GroupprodqueryModule } from './groupprodquery.module';

describe('GroupprodqueryModule', () => {
  let groupprodqueryModule: GroupprodqueryModule;

  beforeEach(() => {
    groupprodqueryModule = new GroupprodqueryModule();
  });

  it('should create an instance', () => {
    expect(groupprodqueryModule).toBeTruthy();
  });
});
