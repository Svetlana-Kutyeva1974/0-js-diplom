import { generateTeam, getRandomInt, generateArray } from './generators.js';
import Bowman from './Bowman.js';
import Swordsman from './Swordsman.js';
import PositionedCharacter from './PositionedCharacter.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  initGameDraw() { // генерирует персонажи + формирует  PositionedCharacter
    const size = this.gamePlay.boardSize;
    const min = 0;
    const max = size ** 2;
    const characterCount = 4;
    const arrayForUser = generateArray(min, max - size + 1, size);
    console.log('получили массив юзера', arrayForUser);
    const arrayForComputer = generateArray(min + size - 2, max - 1, size);
    console.log('получили массив компа', arrayForComputer);
    const team = generateTeam([Bowman, Swordsman], 1, characterCount);
    const ArrayOfPositionCharacter = [];
    console.log('генерируем team', team);
    let count = 0;
    const positionNumber = [];
    for (const num of team.members) {
      let position = 0;
      if (count < characterCount / 2) {
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
      // console.log('position генератор', position);
      // console.log('!!!читаем команду персонаж', num);
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
    console.log('this+index click', this, index);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    console.log('this+index enter', this, index);
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    console.log('this+index leave', this, index);
  }
}
