import { MessagequeryModule } from './messagequery.module';

describe('MessagequeryModule', () => {
  let messagequeryModule: MessagequeryModule;

  beforeEach(() => {
    messagequeryModule = new MessagequeryModule();
  });

  it('should create an instance', () => {
    expect(messagequeryModule).toBeTruthy();
  });
});
