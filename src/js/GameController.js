import { generateTeam, getRandomInt } from './generators.js';
import Bowman from './Bowman.js';
import Swordsman from './Swordsman.js';
import PositionedCharacter from './PositionedCharacter.js';


const characterType = {
  Bowman: 'bowman',
  Swordsman: 'swordsman',
  Undead: 'undead',
  Magician: 'magician',
  Daemon: 'daemon',
  Vampire: 'vampire',
};

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  initGameDraw() {
    const res = generateTeam([Bowman, Swordsman], 1, 4);
    const ArrayOfPositionCharacter = [];
    console.log('генерируем team', res);

    for (const num of res) {
      let position = getRandomInt(7);
      if (position === ArrayOfPositionCharacter.includes(position)) {
        position = getRandomInt(7);
      }
      console.log('position генератор', position);

      const characterNew = res.members[Symbol.iterator]().next().value;
      // ArrayOfPositionCharacter.push(new PositionedCharacter(characterNew, position));
      characterNew.type = characterNew.type.toLowerCase();
      ArrayOfPositionCharacter.push(new PositionedCharacter(characterNew, position));
      console.log('char генератор', ArrayOfPositionCharacter[ArrayOfPositionCharacter.length - 1]);
    }
    console.log('массив позиций', ArrayOfPositionCharacter);
    this.gamePlay.redrawPositions(ArrayOfPositionCharacter);
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.initGameDraw();

    /*
    const res = generateTeam([Bowman, Swordsman], 1, 4);
    const ArrayOfPositionCharacter = [];
    console.log('генерируем team', res);

    for (const num of res) {
    */
      /*
      const characterValue = res.members[Symbol.iterator]().next().value;
      console.log('плэй генератор', num, characterValue, characterType[characterValue]);
      */
     /*
      let position = getRandomInt(7);
      if (position === ArrayOfPositionCharacter.includes(position)) {
        position = getRandomInt(7);
      }
      console.log('position генератор', position);

      const characterNew = res.members[Symbol.iterator]().next().value;
     // ArrayOfPositionCharacter.push(new PositionedCharacter(characterNew, position));
     characterNew.type = characterNew.type.toLowerCase();
     ArrayOfPositionCharacter.push(new PositionedCharacter(characterNew, position));
      console.log('char генератор', ArrayOfPositionCharacter[ArrayOfPositionCharacter.length - 1]);
    }
    console.log('массив позиций', ArrayOfPositionCharacter);
    this.gamePlay.redrawPosition(ArrayOfPositionCharacter);
    */
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
