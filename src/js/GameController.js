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
    this.state = new GameState();// позже статик применить

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
 * Возвращает обьект : персонажа и его позицию из массиве обьектов
 */

  getCharacter(idx) {
    return this.state.ArrayOfPositionCharacter.find((character) => character.position === idx);
  }
  /**
 * Возвращает индекс обьекта персонажа в массиве обьектов
 */

  findChar(char) {
    return this.state.ArrayOfPositionCharacter.findIndex((ch) => ch.character === char);
  }

  getCharIndex(idx) {
    return this.state.ArrayOfPositionCharacter.findIndex((character) => character.position === idx);
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
    return (this.state.activeTeam.toArray().find((char) => char === character.character))
    || undefined;
  }

  async onCellClick(index) {
  // TODO: react to click
    console.log('this+index+актив команда click', this, index, this.state.activeTeam);
    // console.log(this.state.ArrayOfPositionCharacter[this.getCharacter(index)]);

    if (this.state.activeCell !== -1 && this.state.activePlayer !== undefined
      && this.isCharInTeam(this.state.activeCell) !== undefined) {
    // && this.isCharInTeam(index) !== undefined) {
    // && !this.getCharacter(index)) {
      //  {
      this.gamePlay.deselectCell(this.state.activeCell, 'yellow');
    }

    if (this.state.activeCell === -1) { // начало игры
      // this.state.activeTeam = this.state.teamUser; вынести в начальные данные
      do {
        if (this.getCharacter(index)) {
        // если начало игры и выбран персонаж
          if (this.isCharUser(index)) { // персонаж игрока// в общем случае заменить на isCharInTeam
            this.gamePlay.selectCell(index, 'yellow');
            this.state.activeCell = index;
            this.state.activePlayer = this.getCharacter(index).character;
            // this.state.activeTeam = this.state.teamUser;
            console.log('click на персонаже юзера!!!', this.state.activePlayer, this.state.activeTeam);
          } else {
            GamePlay.showError('Не Ваш персонаж');
          }
        }
      }
      while (this.state.activeCell === -1);

    // выбор игрока сделан
    } else if (this.getCharacter(index)) { // игра идет
      // если продолжение игры и выбран некий персонаж
      console.log('продолжаем игру');

      if (this.isCharInTeam(index)) { // персонаж команды активного игрока
        this.gamePlay.setCursor(cursors.pointer);
        console.log('входит в команду- значит перевыбор');
        this.gamePlay.selectCell(index, 'yellow');
        this.state.activeCell = index;
        this.state.activePlayer = this.getCharacter(index).character;
        // this.state.activeTeam = this.state.teamUser;
        console.log('click на новом персонаже юзера!!!', this.state.activePlayer, this.state.activeTeam);
      } else if (this.checkAllowPoints(index, this.state.activePlayer.attackDistance)) {
        // если есть активный персонаж, а клик на песонаже противника =
        //  проверка возможна ли  атака&
        console.log('возможна атака');
        //  this.attack();

        const personAttack = this.state.activePlayer;
        const target = this.getCharacter(index).character;
        console.log('цель', target);
        const damage = Math.max(personAttack.attack - target.defence, personAttack.attack * 0.1);
        await this.gamePlay.showDamage(index, damage);
        console.log('атака прошла урон:', damage);
        target.health -= damage;
        this.gamePlay.deselectCell(index);
        this.gamePlay.selectCell(this.state.activeCell, 'yellow');
        this.gamePlay.setCursor(cursors.pointer);
        if (target.health <= 0) {
          this.deleteChar(target.position);
          this.teamComputer.delete(target.character);
          // this.gamePlay.deselectCell(this.gameState.selected);
          // this.gameState.selected = null;
        }
        this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
        // end
        this.transferComp();
        this.checkState();// проверка уровня и состояния игры
        // закончили и передали ход
      } else {
        GamePlay.showError('Атака не возможна!!!');
      }
      // нет какого-либо персонажа в кликнутой клетке
    } else if (!this.getCharacter(index)
    && this.checkAllowPoints(index, this.state.activePlayer.distance)) {
      // клетка пустая выбрана, проверка на возможное перемещение

      // функция перемещения
      console.log('возможно перемещение');
      // --
      this.gamePlay.deselectCell(this.state.activeCell);
      this.gamePlay.selectCell(index, 'yellow');// проверить нужны ли эти2 строчки

      // меняем элемент в массиве позиций
      // const Findcharacter = this.getCharacter(this.state.activeCell).position;
      // находим обьект активного персонажа и меняем его позицию

      console.log('array position before', this.state.ArrayOfPositionCharacter,
        this.state.activeCell, index, 'данные \n', this.getCharIndex(this.state.activeCell),
        new PositionedCharacter(this.getCharacter(this.state.activeCell).character, index));

      const number = this.state.ArrayOfPositionCharacter
        .indexOf(this.getCharacter(this.state.activeCell));
      // this.state.ArrayOfPositionCharacter.splice(this.getCharIndex(this.state.activeCell), 1,
      this.state.ArrayOfPositionCharacter.splice(number, 1,
        new PositionedCharacter(this.getCharacter(this.state.activeCell).character, index));
      console.log('array position new', this.state.ArrayOfPositionCharacter, this.state.activeCell, index);
      this.gamePlay.deselectCell(this.state.activeCell);
      this.state.activeCell = index;
      this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
      this.gamePlay.selectCell(index, 'yellow');
      //  и похоже задвоение см 168 строку

      // ---
      // переход хода?
      /*
      if (this.state.activeTeam === this.state.teamUser) {
        this.state.activeTeam = this.state.teamComp;
        this.state.activeCell === -1;
      } else {
        this.state.activeTeam = this.state.teamUser;
        this.state.activeCell === -1;
      }
      */
      // переход хода?
      this.transferComp();
    } else if (!this.getCharacter(index)
    && !this.checkAllowPoints(index, this.state.activePlayer.distance)) {
      GamePlay.showError('Перемещение не возможно!!!');
    }
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
        if (this.checkAllowPoints(index, this.state.activePlayer.attackDistance)) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
          // ждем функ атаки
        } else {
          // GamePlay.showError('Недопустимая позиция атаки');
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    } else if (this.state.activePlayer) { // клетка пуста, но есть активный игрок
      // возможно перемещение
      // allowPointsMove.filter((elem) => this.isCharInTeam(elem) === undefined);
      if (this.checkAllowPoints(index, this.state.activePlayer.distance)) {
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
    if (this.getCharacter(index)) { // eсть персонаж
      this.gamePlay.hideCellTooltip(index);
    } else {
      this.gamePlay.deselectCell(index); // пустая клетка
      // this.gamePlay.setCursor(cursors.pointer);
    }
  }

  onNewGame() {
    this.state = new GameState();

    this.gamePlay.drawUi(themes[`level${this.state.level}`]);
    this.initGameDraw();
    this.state.activeTeam = this.state.teamUser;

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
    // console.log('границы', leftBorder, rightBorder, topBorder, bottomBorder);

    // столбец с числоv
    for (let n = 1; n <= charCharacter; n += 1) {
      if (topBorder.includes(idx)) {
        points.push(idx + (b * n));
        // points.push(idx + (b * n)+ 1);
        // console.log('границы', (idx + (b * n)));
      } else if (bottomBorder.includes(idx)) {
        points.push(idx - (b * n));
      } else {
        points.push(idx + (b * n));
        points.push(idx - (b * n));
        // console.log('формируем', (idx + (b * n)), (idx - (b * n)));
      }

      if (!leftBorder.includes(idx - (n - 1))) {
      // if (!leftBorder.includes(idx - 1)) {
        // левая сторона от числа
        points.push(idx - n);
        points.push(idx - (b * n + n));
        points.push(idx + (b * n - n));

        // console.log('формируем left', (idx - n), (idx + (b * n - n)), (idx - (b * n + n)));
        for (let j = 1; j <= n - 1; j += 1) {
        // if (n <= char - 1){
          points.push(idx + (b - 1) * n - b * j);
          points.push(idx - (b + 1) * n + b * j);

          points.push(idx + (b - 1) * n + j);
          points.push(idx - (b + 1) * n + j);
        }
      } else if (!topBorder.includes(idx - (n - 1) - b)) {
        for (let j = 1; j <= n - 1; j += 1) {
          points.push(idx - (b + 1) * n + j);//
        }
      } else if (!bottomBorder.includes(idx - (n - 1) + b)) {
        for (let j = 1; j <= n - 1; j += 1) {
          points.push(idx + (b - 1) * n + j); //
        }
      } else {
        for (let j = 1; j <= n - 1; j += 1) {
          points.push(idx + (b - 1) * n + j);
          points.push(idx - (b + 1) * n + j);
        }
      }

      // points.push(idx + b*n);
      if (!rightBorder.includes(idx + (n - 1))) {
      // if (!rightBorder.includes(idx - 1)) {
      // if (!rightBorder.includes(idx)) {

        // правая сторона от числа
        points.push(idx + n);
        points.push(idx - (b * n - n));
        points.push(idx + (b * n + n));

        for (let j = 1; j <= n - 1; j += 1) {
        // if (n <= char - 1) {
          points.push(idx - (b - 1) * n + b * j);
          points.push(idx + (b + 1) * n - b * j);
          points.push(idx - (b - 1) * n - j);
          points.push(idx + (b + 1) * n - j);
        }
      } else if (!topBorder.includes(idx + (n - 1) - b)) {
        for (let j = 1; j <= n - 1; j += 1) {
          points.push(idx - (b - 1) * n - j);
        }
      } else if (!bottomBorder.includes(idx + (n - 1) + b)) {
        for (let j = 1; j <= n - 1; j += 1) {
          points.push(idx + (b + 1) * n - j);// ! низ!
        }
      } else {
        for (let j = 1; j <= n - 1; j += 1) {
          points.push(idx - (b - 1) * n - j);
          points.push(idx + (b + 1) * n - j);
        }
      }
    }
    return points.filter((elem) => elem >= 0 && elem <= (b ** 2 - 1));
  }

  checkAllowPoints(idx, charCharacter) {
    const allowPoints = this.calcPoints(this.state.activeCell, charCharacter);
    const value = allowPoints.includes(idx);
    console.log('допустимые перемещения/атака', allowPoints, value);
    return value;
  }

  deleteChar(index) {
    const number = this.state.ArrayOfPositionCharacter
      .indexOf(this.getCharacter(index));
    this.state.ArrayOfPositionCharacter.splice(number, 1);
    // console.log('array position new', this.state.ArrayOfPositionCharacter, index);
    this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
  }

  async transferComp() {
    console.log(this);
    const oldactive = this.state.activeCell;
    const oldPlayer = this.state.activePlayer;

    this.state.activeTeam = this.state.teamComputer;
    console.log('менякм актив команду', this.state.activeTeam);
    const arr = this.state.activeTeam.toArray();
    const sum = this.state.ArrayOfPositionCharacter.length;
    const idxInTeam = getRandomInt(arr.length, sum - 1);
    console.log('инд в масс противника', idxInTeam);
    const { character, position } = this.state.ArrayOfPositionCharacter[idxInTeam];

    this.state.activePlayer = this.getCharacter(position).character;
    this.state.activeCell = position;
    // выбрали игрока компьютера
    console.log('игрок противника', position, character.type, this.state.ArrayOfPositionCharacter[idxInTeam]);
    console.log(this.state.activePlayer);
    // возможна ли атака? если да, атакуем, нет - перемещаемся
    //
    let attack = this.state.ArrayOfPositionCharacter[0].position;
    for (let j = 1; j < this.state.teamUser.toArray().length; j += 1) {
      if ((this.state.ArrayOfPositionCharacter[j].position - position) <= (attack - position)) {
        attack = this.state.ArrayOfPositionCharacter[j].position;
      }
    }
    const allowPoints = this.calcPoints(position, this.state.activePlayer.attackDistance);
    const allowPoints2 = this.calcPoints(position, this.state.activePlayer.distance);
    const value = allowPoints.includes(attack);
    if (value) {
      // если есть активный персонаж, а клик на песонаже противника =
      //  проверка возможна ли  атака&
      console.log('возможна атака, т.к есть персонаж в зоне атаки\n value', value);
      const personAttacker = character;
      const target = this.getCharacter(attack).character;
      console.log('цель', target);
      const damage = Math.max(personAttacker.attack - target.defence, personAttacker.attack * 0.1);
      await this.gamePlay.showDamage(attack, damage);
      console.log('атака прошла урон:', damage);
      target.health -= damage;
      if (target.health <= 0) {
        this.deleteChar(target.position);// удаляем в общем массиве
        this.teamUser.delete(target.character); //
      }
      this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
      this.checkState();// проверка уровня и состояния игры
      //  this.attack();
    } else {
      GamePlay.showError('играет компьютер!Атака не возможна!!!');// делаем перемещение
      //
      // находим случайную точку в массиве возможных
      const index1 = getRandomInt(0, allowPoints2.length - 1);
      console.log(' индекс в массиве допустим перемещ и сам массив ', index1, allowPoints2);
      const indexNew = allowPoints2[index1];
      console.log('новая выбранная поциция комп', indexNew);
      // move
      console.log('array position before', this.state.ArrayOfPositionCharacter,
        position, indexNew, 'данные \n', this.getCharIndex(position));

      const number = this.state.ArrayOfPositionCharacter
        .indexOf(this.getCharacter(position));
      this.state.ArrayOfPositionCharacter.splice(number, 1,
        new PositionedCharacter(this.getCharacter(position).character, indexNew));

      console.log('array position new', this.state.ArrayOfPositionCharacter, position, indexNew);
      this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
      // this.gamePlay.deselectCell(this.state.activeCell);
    }

    this.state.activeTeam = this.state.teamUser;
    this.state.activeCell = oldactive;
    this.state.activePlayer = oldPlayer;
    // return { character, position };
    //
  }

  checkState() {
    console.log(this);
  }
}
