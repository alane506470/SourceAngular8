import { GameaddModule } from './gameadd.module';

describe('GameaddModule', () => {
  let gameaddModule: GameaddModule;

  beforeEach(() => {
    gameaddModule = new GameaddModule();
  });

  it('should create an instance', () => {
    expect(gameaddModule).toBeTruthy();
  });
});
