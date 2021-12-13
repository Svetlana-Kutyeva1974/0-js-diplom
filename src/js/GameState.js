import Team from './Team.js';

export default class GameState {
  static from(object) {
    const {
      health,
      level,
      activePlayer,
      characterCount,
      ArrayOfPositionCharacter,
      scope,
      scopeMax,
      teamUser,
      teamComputer,
      activeCell,
    } = object;
    // return object;
    return {
      health,
      level,
      activePlayer,
      characterCount,
      ArrayOfPositionCharacter,
      scope,
      scopeMax,
      teamUser,
      teamComputer,
      activeCell,
    };
  }

  constructor() {
    this.health = 50;
    this.level = 1;
    this.activePlayer = 0;
    this.ArrayOfPositionCharacter = [];
    this.characterCount = 2;
    this.scope = 0;
    this.scopeMax = 0;
    this.teamUser = new Team();
    this.teamComputer = new Team();
    this.activeCell = null;
  }
}
