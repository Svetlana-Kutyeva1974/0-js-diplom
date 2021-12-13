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
// import Team from './Team.js';
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

    // const ArrayOfPositionCharacter = [];

    console.log('генерируем team', this.state.teamUser, this.state.teamComputer);
    // let count = 0;
    const positionNumberUser = [];
    const positionNumberComp = [];
    /*

    let position = 0;
    for (const num of this.teamUser.members) {
      do {
        position = arrayForUser[getRandomInt(0, arrayForUser.length - 1)];
      } while (positionNumberUser.indexOf(position) !== -1);
      positionNumberUser.push(position);
      this.ArrayOfPositionCharacter.push(new PositionedCharacter(num, position));
    }
    */
    this.getArrayPositions(arrayForUser, positionNumberUser, this.state.teamUser);
    this.getArrayPositions(arrayForComputer, positionNumberComp, this.state.teamComputer);

    /*
    for (const num of this.teamComputer.members) {
      do {
        position = arrayForComputer[getRandomInt(0, arrayForComputer.length - 1)];
      } while (positionNumberComp.indexOf(position) !== -1);
      positionNumberComp.push(position);
      this.ArrayOfPositionCharacter.push(new PositionedCharacter(num, position));
    }
    */
    // console.log('position генератор', position);
    // console.log('!!!читаем команду персонаж', num);
    // console.log('char генератор', ArrayOfPositionCharacter[ArrayOfPositionCharacter.length - 1]);
    console.log('char генератор', this.state.ArrayOfPositionCharacter);

    console.log('массив позиций', this.state.ArrayOfPositionCharacter);

    // this.gamePlay.redrawPositions(this.ArrayOfPositionCharacter);
  }

  init() {
    /*
    if (this.stateService.load() !== null) {
      this.state.activePlayer = this.stateService.load().activePlayer;
      this.state.level = this.stateService.load().level;
    } else {
      this.state.activePlayer = 0;
      this.state.level = 1;
    }
    */

    // this.gamePlay.drawUi('prairie');
    // console.log('тема', themes[`level${this.level}`]);
    this.gamePlay.drawUi(themes[`level${this.state.level}`]);
    // this.initGameDraw();

    // TODO: add event listeners to gamePlay events
    /*
    this.gamePlay.addNewGameListener((cellIndex) => this.gamePlay.onNewGameClick(cellIndex));
    this.gamePlay.addSaveGameListener((cellIndex) => this.gamePlay.onSaveGameClick(cellIndex));
    this.gamePlay.addLoadGameListener((cellIndex) => this.gamePlay.onLoadGameClick(cellIndex));
    */
    this.gamePlay.addNewGameListener(() => this.onNewGame());
    this.gamePlay.addSaveGameListener(() => this.onSaveGame());
    this.gamePlay.addLoadGameListener(() => this.onLoadGame());
    /*
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    */

    this.gamePlay.addCellEnterListener((cellIndex) => this.onCellEnter(cellIndex));
    this.gamePlay.addCellClickListener((cellIndex) => this.onCellClick(cellIndex));
    this.gamePlay.addCellLeaveListener((cellIndex) => this.onCellLeave(cellIndex));

    // TODO: load saved stated from stateService
    // GamePlay.showMessage(`Уровень ${this.state.level}`);
  }

  someMethodName() { // <- что это за метод и где это нужно сделать решите сами( вывод подсказки)
    this.gameplay.addCellEnterListener(this.onCellEnter);
  }

  onCellClick(index) {
  // TODO: react to click
  // this.gamePlay.selectCell(index, 'yellow');
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

  onNewGame() {
    /*
    this.state.teamUser = new Team();
    this.state.teamComputer = new Team();
    this.activeCell = null;
    this.state.level = 1;
    this.state.scope = 0;
    this.state.scopeMax = 0;
    this.state.ArrayOfPositionCharacter = [];
    */
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
}
