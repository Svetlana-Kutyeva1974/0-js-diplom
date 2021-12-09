import { generateTeam, getRandomInt, generateArray } from './generators.js';
import Bowman from './Bowman.js';
import Swordsman from './Swordsman.js';
import PositionedCharacter from './PositionedCharacter.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  initGameDraw() {
    const size = this.gamePlay.boardSize;
    const min = 0;
    const max = size ** 2;
    const arrayForUser = generateArray(min, max - size + 1, size);
    console.log('получили массив юзера', arrayForUser);
    /*
    const arrayForUser = generateArray(min, max - size, size);
    arrayForUser.concat(generateArray(min + 1, max, size));
    */
    const arrayForComputer = generateArray(min + size - 2, max - 1, size);
    console.log('получили массив компа', arrayForComputer);
    /*
    const arrayForComputer = generateArray(min + size - 2, max - 2, size);
    arrayForUser.concat(generateArray(min + size - 1, max - 1, size));
    */
    const team = generateTeam([Bowman, Swordsman], 1, 4);
    const ArrayOfPositionCharacter = [];
    console.log('генерируем team', team, team.members);
    let count = 0;
    const positionNumber = [];
    for (const num of team.members) {
      let position = 0;
      if (count < 2) {
        do {
          position = arrayForUser[getRandomInt(0, arrayForUser.length - 1)];
        } while (positionNumber.indexOf(position) !== -1);
        positionNumber.push(position);
      } else {
        do {
          position = arrayForComputer[getRandomInt(0, arrayForComputer.length - 1)];
        } while (positionNumber.indexOf(position) !== -1);
        positionNumber.push(position);
      }
      count += 1;
      console.log('position генератор', position);
      // characterNew = team.members.values().next().value;
      console.log('!!!читаем команду персонаж', num);
      // ArrayOfPositionCharacter.push(new PositionedCharacter(characterNew, position));
      // characterNew.type = characterNew.type.toLowerCase();

      ArrayOfPositionCharacter.push(new PositionedCharacter(num, position));
      console.log('char генератор', ArrayOfPositionCharacter[ArrayOfPositionCharacter.length - 1]);
    }
    console.log('массив позиций', ArrayOfPositionCharacter);

    this.gamePlay.redrawPositions(ArrayOfPositionCharacter);
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.initGameDraw();
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
  // TODO: react to click
    console.log('this+index', this, index);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    console.log('this+index', this, index);
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    console.log('this+index', this, index);
  }
}
