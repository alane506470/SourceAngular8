import { MessageaddModule } from './messageadd.module';

describe('MessageaddModule', () => {
  let messageaddModule: MessageaddModule;

  beforeEach(() => {
    messageaddModule = new MessageaddModule();
  });

  it('should create an instance', () => {
    expect(messageaddModule).toBeTruthy();
  });
});
