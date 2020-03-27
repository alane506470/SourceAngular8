import { MessageMgtModule } from './message-mgt.module';

describe('MessageMgtModule', () => {
  let messageMgtModule: MessageMgtModule;

  beforeEach(() => {
    messageMgtModule = new MessageMgtModule();
  });

  it('should create an instance', () => {
    expect(messageMgtModule).toBeTruthy();
  });
});
