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
import cursors from './cursors.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
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

    this.state.teamUser = generateTeam([Bowman, Swordsman, Magician],
      this.state.level, this.state.characterCount);
    this.state.teamComputer = generateTeam([Undead, Daemon, Vampire],
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
    this.state = new GameState();

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
  /**
 * Возвращает обьект : персонажа и его позицию из массиве позиций
 */

  getCharacter(idx) {
    return this.state.ArrayOfPositionCharacter.find((character) => character.position === idx);
  }

  isCharUser(idx) {
    const character = this.getCharacter(idx);
    return this.state.teamUser.toArray().find((char) => char === character.character);
  }

  isCharComp(idx) {
    const character = this.getCharacter(idx);
    return this.state.teamComputer.toArray().find((char) => char === character.character);
  }

  isCharInTeam(idx) {
    const character = this.getCharacter(idx);
    return (this.state.activeTeam.toArray().find((char) => char === character.character));
  }

  onCellClick(index) {
  // TODO: react to click
  // let activeTeam = this.state.teamUser;
    // let count = this.state.teamUser.members.size;

    // let count = this.state.activeTeam.members.size;
    /*
    if (this.state.activePlayer !== undefined) {
      this.state.activeTeam = this.state.teamComputer;
      count = this.state.activeTeam.members.size;
    }
    */
    console.log('this+index+актив команда click', this, index, this.state.activeTeam);
    // console.log(this.state.ArrayOfPositionCharacter[this.getCharacter(index)]);

    if ((this.state.activeCell !== -1 && this.state.activePlayer !== undefined)
    && this.isCharInTeam(index) !== undefined) {
      //  {
      this.gamePlay.deselectCell(this.state.activeCell, 'yellow');
    }

    if (this.state.activeCell === -1) { // начало игры
      this.state.activeTeam = this.state.teamUser;
      do {
        if (this.getCharacter(index)) {
        // если начало игры и выбран персонаж
          if (this.isCharUser(index)) { // персонаж игрока
            this.gamePlay.selectCell(index, 'yellow');
            this.state.activeCell = index;
            this.state.activePlayer = this.getCharacter(index).character;
            // this.state.activeTeam = this.state.teamUser;
            console.log('click на персонаже юзера!!!', this.state.activePlayer, this.state.activeTeam);
          } else {
            GamePlay.showError('Не Ваш персонаж');
          }
        // } else {
        // передвижение или атака
        // this.gamePlay.selectCell(index, 'red');
        // console.log('ждемclick');
        }
      }
      while (this.state.activeCell === -1);
      // выбор игрока сделан
    } else if (this.getCharacter(index)) { // игра идет
      // если продолжение игры и выбран персонаж

      console.log('продолжаем игру');

      if (this.isCharInTeam(index)) { // персонаж команды активного игрока
        this.gamePlay.setCursor(cursors.pointer);
        console.log('входит в команду- значит перевыбор');
        this.gamePlay.selectCell(index, 'yellow');
        this.state.activeCell = index;

        this.state.activePlayer = this.getCharacter(index).character;
        // this.state.activeTeam = this.state.teamUser;
        console.log('click на новом персонаже юзера!!!', this.state.activePlayer, this.state.activeTeam);
      } else {
        // если есть активный персонаж, а клик на песонаже противника =
        //  проверка возможна ли  атака&
        GamePlay.showError('Не Ваш персонаж');
      }
    }
    /*
    if (this.state.activeCell !== null && this.state.activePlayer !== undefined) {
      const allowPointsMove = this.calcPoints(this.state.activeCell,
        this.state.activePlayer.distance);
      console.log('массив допустимых перемещений', allowPointsMove);

      if (allowPointsMove.includes(this.state.activeCell)) {
        this.gamePlay.selectCell(index, 'red');
      } else {
        GamePlay.showError('Недопустимая позиция');
      }
      // this.gamePlay.selectCell(index, 'red');
      console.log('ждемclick');
    }
    */
  }

  showTools(positionedCharacter) {
    const { character, position } = positionedCharacter;
    const message = `\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`;
    this.gamePlay.showCellTooltip(message, position);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // this.gamePlay.setCursor(cursors.auto);
    const character = this.getCharacter(index);// получаем обьект в заданной клетке
    console.log('this+index enter', this, index, character);
    // this.state.ArrayOfPositionCharacter(id)
    if (character !== undefined) {
      this.showTools(character);
      // есть персонаж,но он персонаж не активного игрока, проверяем на атаку

      if (this.state.activePlayer && !this.isCharInTeam(index)) {
        const allowPointsAttack = this.calcPoints(this.state.activeCell,
          this.state.activePlayer.attackDistance);
        if (allowPointsAttack.includes(index)) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
        } else {
          // GamePlay.showError('Недопустимая позиция атаки');
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    } else if (this.state.activePlayer) { // клетка пуста, но есть активный игрок
      const allowPointsMove = this.calcPoints(this.state.activeCell,
        this.state.activePlayer.distance);
      // allowPointsMove.filter((elem) => this.isCharInTeam(elem) === undefined);
      /*
      const allowPointsAttack = this.calcPoints(this.state.activeCell,
        this.state.activePlayer.attackDistance);
      */
      console.log('массив допустимых перемещений', allowPointsMove, this.state.activePlayer.distance);

      if (allowPointsMove.includes(index)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        // GamePlay.showError('Недопустимая позиция перемещения');
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
    // this.gamePlay.setCursor(cursors.auto);
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    console.log('this+index leave', this, index);
    // this.gamePlay.setCursor(cursors.pointer);
    if (this.getCharacter(index)) {
      this.gamePlay.hideCellTooltip(index);
    } else {
      this.gamePlay.deselectCell(index);
      // this.gamePlay.setCursor(cursors.pointer);
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

    // this.state = new GameState();
    this.gamePlay.drawUi(themes[`level${this.state.level}`]);
  }

  onLoadGame() {
    GamePlay.showMessage('Please, wait, loading...');
    this.state = this.stateService.load();
    // this.state = GameState.from(this.stateService.load());
    console.log('loading', this.stateService.load(), this.state);
    this.gamePlay.drawUi(themes[`level${this.state.level}`]);
    this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
    GamePlay.showMessage(`Level ${this.state.level}`);

    this.gamePlay.selectCell(this.state.activeCell, 'yellow');
  }

  // допустимые перемещения
  calcPoints(idx, charCharacter) {
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
    for (let n = 1; n <= charCharacter; n += 1) {
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
/*
  isInCalcPoints(idx, charCharacter) {
  }
  */
}
