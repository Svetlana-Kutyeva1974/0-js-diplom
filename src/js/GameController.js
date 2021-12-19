import { generateTeam, getRandomInt, generateArray } from './generators.js';
import Bowman from './Bowman.js';
import Swordsman from './Swordsman.js';
import Undead from './Undead.js';
import Magician from './Magician.js';
import Daemon from './Daemon.js';
import Vampire from './Vampire.js';
import PositionedCharacter from './PositionedCharacter.js';
import themes from './themes.js';
import GameState from './GameState.js';
import GamePlay from './GamePlay.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = new GameState();
    // this.teamUser = new Team();
    // this.teamComputer = new Team();
    // this.ArrayOfPositionCharacter = [];
    // this.activePlayer = 0;
    // this.level = 1;
  }

  getArrayPositions(array, positionNumber, team) {
    let position = 0;
    for (const num of team.members) {
      do {
        position = array[getRandomInt(0, array.length - 1)];
      } while (positionNumber.indexOf(position) !== -1);
      positionNumber.push(position);
      this.state.ArrayOfPositionCharacter.push(new PositionedCharacter(num, position));
    }
  }

  initGameDraw() { // генерирует персонажи + формирует  PositionedCharacter
    const size = this.gamePlay.boardSize;
    const min = 0;
    const max = size ** 2;

    const arrayForUser = generateArray(min, max - size + 1, size);
    console.log('получили массив юзера', arrayForUser);
    const arrayForComputer = generateArray(min + size - 2, max - 1, size);
    console.log('получили массив компа', arrayForComputer);

    this.state.teamUser = generateTeam([Bowman, Swordsman],
      this.state.level, this.state.characterCount);
    this.state.teamComputer = generateTeam([Bowman, Swordsman, Undead, Magician, Daemon, Vampire],
      this.state.level, this.state.characterCount);
    // подумать, как для 2-4 уровня параметр максимума задать

    console.log('генерируем team', this.state.teamUser, this.state.teamUser.size, this.state.teamComputer, this.state.teamComputer.size);

    const positionNumberUser = [];
    const positionNumberComp = [];

    this.getArrayPositions(arrayForUser, positionNumberUser, this.state.teamUser);
    this.getArrayPositions(arrayForComputer, positionNumberComp, this.state.teamComputer);

    console.log('char генератор', this.state.ArrayOfPositionCharacter);
    console.log('массив позиций', this.state.ArrayOfPositionCharacter, this.state.ArrayOfPositionCharacter[0]);

    // this.gamePlay.redrawPositions(this.ArrayOfPositionCharacter);
  }

  init() {

    this.gamePlay.drawUi(themes[`level${this.state.level}`]);

    this.gamePlay.addNewGameListener(() => this.onNewGame());
    this.gamePlay.addSaveGameListener(() => this.onSaveGame());
    this.gamePlay.addLoadGameListener(() => this.onLoadGame());
    /*
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
    */
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
  }

  getCharacter(idx) {
    return this.state.ArrayOfPositionCharacter.findIndex((character) => character.position === idx);
  }

  onCellClick(index) {
  // TODO: react to click
    let activeTeam = this.state.teamUser;
    let count = this.state.teamUser.members.size;
    if (this.state.activePlayer !== 0) {
      activeTeam = this.state.teamComputer;
      count = activeTeam.members.size;
    }
    console.log('this+index click', this, index, activeTeam);
    console.log(this.state.ArrayOfPositionCharacter[this.getCharacter(index)]);

    if (this.state.activeCell !== null) {
      this.gamePlay.deselectCell(this.state.activeCell, 'yellow');
    }
    if (this.getCharacter(index) !== -1) {
      if (this.getCharacter(index) < count) {
        this.gamePlay.selectCell(index, 'yellow');
        this.state.activeCell = index;
       /* if (this.state.activePlayer === 0) {
          this.state.activePlayer = 1;
        } else {
          this.state.activePlayer = 0;
        }
        */
      } else {
        GamePlay.showError('Не Ваш персонаж');
      }
    }
  }

  showTools(index) {
    // `\u{1F396}${this.level}\u{2694}${this.attack}\u{1F6E1}${char.defence}\u{2764}${char.health}`;
    const message = `\u{1F396}${6}\u{2694}${7}\u{1F6E1}${50}\u{2764}${100}`;
    this.gamePlay.showCellTooltip(message, index);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const id = this.getCharacter(index);
    console.log('this+index enter', this, index, this.getCharacter(index));
    // this.state.ArrayOfPositionCharacter(id)
    if (id !== -1) {
      this.showTools(index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    console.log('this+index leave', this, index);
    if (this.getCharacter(index) !== -1) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  onNewGame() {
    this.state = new GameState();
    this.gamePlay.drawUi(themes[`level${this.state.level}`]);
    this.initGameDraw();

    this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
    GamePlay.showMessage(`Level ${this.state.level}`);
  }

  onSaveGame() {
    console.log('this', this);
    this.stateService.save(this.state);
    console.log('saving', this.state);
    GamePlay.showMessage(`Please, wait, saving: Level ${this.state.level}`);

    this.state = new GameState();
    this.gamePlay.drawUi(themes[`level${this.state.level}`]);
  }

  onLoadGame() {
    GamePlay.showMessage('Please, wait, loading...');
    this.stateService.load();
    this.state = GameState.from(this.stateService.load());
    console.log('loading', this.stateService.load(this.state), this.state);
    this.gamePlay.drawUi(themes[`level${this.state.level}`]);
    this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
    GamePlay.showMessage(`Level ${this.state.level}`);
  }

  calcPoints(idx, char) {
    const b = this.gamePlay.boardSize;
    const points = [];
    const leftBorder = [];
    const rightBorder = [];
    const topBorder = [];
    const bottomBorder = [];

    for (let i = 0; i < b ** 2; i += b) {
      leftBorder.push(i);
      rightBorder.push(i + b - 1);
    }

    for (let i = 0; i < b; i += 1) {
      topBorder.push(i);
      bottomBorder.push(b ** 2 - 1 - i);
    }
    console.log('границы', leftBorder, rightBorder, topBorder, bottomBorder);

    // столбец с числоv
    for (let n = 1; n <= char; n += 1) {
      if (topBorder.includes(idx)) {
        points.push(idx + (b * n));
        // points.push(idx + (b * n)+ 1);
        console.log('границы', (idx + (b * n)));
      } else if (bottomBorder.includes(idx)) {
        points.push(idx - (b * n));
      } else {
        points.push(idx + (b * n));
        points.push(idx - (b * n));
        console.log('формируем', (idx + (b * n)), (idx - (b * n)));
      }

      if (!leftBorder.includes(idx - (n - 1))) {
        points.push(idx - n);
        points.push(idx - (b * n + n));
        points.push(idx + (b * n - n));
        console.log('формируем left', (idx - n), (idx + (b * n - n)), (idx - (b * n + n)));
      }
      // points.push(idx + b*n);

      if (!rightBorder.includes(idx + (n - 1))) {
        points.push(idx + n);
        points.push(idx - (b * n - n));
        points.push(idx + (b * n + n));
      }
    }
    return points.filter((elem) => elem >= 0 && elem <= (b ** 2 - 1));
  }
}
