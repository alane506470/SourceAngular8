import { GroupprodaddModule } from './groupprodadd.module';

describe('GroupprodaddModule', () => {
  let groupprodaddModule: GroupprodaddModule;

  beforeEach(() => {
    groupprodaddModule = new GroupprodaddModule();
  });

  it('should create an instance', () => {
    expect(groupprodaddModule).toBeTruthy();
  });
});
