export default class GameState {
  static from(object) {
    /*
    const {
      health,
      level,
      activePlayer,
      characterCount,
      PositionedCharacter,
    } = object;
    */
    const { state } = object;
    // TODO: create object
    return state;
  }

  constructor(object) {
    const {
      health,
      level,
      activePlayer,
      characterCount,
      PositionedCharacter,
    } = object;
    this.health = health;
    this.level = level;
    this.activePlayer = activePlayer;
    this.PositionedCharacter = PositionedCharacter;
    this.characterCount = characterCount;
    // GameState.from(object);
  }
}
