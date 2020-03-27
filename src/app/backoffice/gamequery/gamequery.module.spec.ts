import { GamequeryModule } from './gamequery.module';

describe('GamequeryModule', () => {
  let gamequeryModule: GamequeryModule;

  beforeEach(() => {
    gamequeryModule = new GamequeryModule();
  });

  it('should create an instance', () => {
    expect(gamequeryModule).toBeTruthy();
  });
});
