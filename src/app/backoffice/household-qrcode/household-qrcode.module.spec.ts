import { HouseholdQrcodeModule } from './household-qrcode.module';

describe('HouseholdQrcodeModule', () => {
  let householdQrcodeModule: HouseholdQrcodeModule;

  beforeEach(() => {
    householdQrcodeModule = new HouseholdQrcodeModule();
  });

  it('should create an instance', () => {
    expect(householdQrcodeModule).toBeTruthy();
  });
});
