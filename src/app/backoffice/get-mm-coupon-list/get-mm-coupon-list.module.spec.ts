import { GetMmCouponListModule } from './get-mm-coupon-list.module';

describe('GetMmCouponListModule', () => {
  let getMmCouponListModule: GetMmCouponListModule;

  beforeEach(() => {
    getMmCouponListModule = new GetMmCouponListModule();
  });

  it('should create an instance', () => {
    expect(getMmCouponListModule).toBeTruthy();
  });
});
