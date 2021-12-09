export default class GameState {
  static from(object) {
    /*
    const {
      stateHealth,
      activePlayer,
      PositionedCharacter,
      countCharacterUser,
      countCharacterComputer,
    } = object;
    */
    // TODO: create object
    return null;
  }

  constructor(object) {
    const {
      stateHealth,
      level,
      activePlayer,
      countCharacterUser, countCharacterComputer, PositionedCharacter,
    } = object;
    this.stateHealth = stateHealth;
    this.level = level;
    this.activePlayer = activePlayer;
    this.PositionedCharacter = PositionedCharacter;
    this.countCharacterUser = countCharacterUser;
    this.countCharacterComputer = countCharacterComputer;
  }
}
