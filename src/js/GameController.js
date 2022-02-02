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
    // this.state = new GameState();//
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

    if (this.state.level === 1) {
      this.state.teamUser = generateTeam([Bowman, Swordsman, Magician],
        this.state.level, this.state.characterCount);
      this.state.teamComputer = generateTeam([Undead, Daemon, Vampire],
        this.state.level, this.state.characterCount);
    } else {
      this.state.teamUser.addAll(...generateTeam([Bowman, Swordsman, Magician],
        this.state.level - 1, this.state.characterCount).members);
      this.state.teamComputer.addAll(...generateTeam([Undead, Daemon, Vampire],
        this.state.level, this.state.teamUser.members.size).members);
    }
    //  для 2-4 уровня параметр максимума задать

    console.log('генерируем team', this.state.teamUser, this.state.teamUser.members.size,
      this.state.teamComputer, this.state.teamComputer.members.size);

    const positionNumberUser = [];
    const positionNumberComp = [];

    this.state.ArrayOfPositionCharacter = []; // обнуляем?

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
    // return (this.state.activeTeam.toArray().find((char) => char === character.character));
  }

  async onCellClick(index) {
  // TODO: react to click
    console.log('this+index+актив команда click', this, index, this.state.activeTeam);
    // console.log(this.state.ArrayOfPositionCharacter[this.getCharacter(index)]);

    if (this.state.activeCell !== -1 && this.state.activePlayer !== undefined) {
    // && this.isCharInTeam(this.state.activeCell) !== undefined) {
    // && this.isCharInTeam(index) !== undefined) {
    // && !this.getCharacter(index)) {
      //  {
      // this.gamePlay.selectCell(this.state.activeCell, 'yellow');
      this.gamePlay.deselectCell(this.state.activeCell);
    }

    if (this.state.activeCell === -1) { // начало игры или новый уровень
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
        this.gamePlay.deselectCell(index);// снимаем красный пунктир заранее,
        const personAttack = this.state.activePlayer;
        const target = this.getCharacter(index).character;
        const attack = this.getCharacter(index).position;
        console.log('командf противника', this.state.teamComputer);
        console.log('цель в команде противника', target);
        const damage = Math.max(personAttack.attack - target.defence,
          personAttack.attack * 0.1).toFixed();
        await this.gamePlay.showDamage(index, damage);
        console.log('атака прошла урон противнику:', damage);
        target.health -= damage;
        // this.gamePlay.deselectCell(index);

        this.gamePlay.selectCell(this.state.activeCell, 'yellow'); // ???

        this.gamePlay.setCursor(cursors.pointer);
        // урон критичный:
        if (target.health <= 0) {
          // this.deleteChar(target.position);// изменить
          // console.log(' удаление этого эле в масс позиций:', this.getCharIndex(target.position));
          console.log(' удаление этого элемента в массиве позиций:', attack);
          this.deleteChar(this.getCharIndex(attack));
          // this.deleteChar(this.getCharIndex(target.position)); // позиция
          // в ArrayOfPositionCharacter найти!!!
          this.state.teamComputer.delete(target);
          // this.gamePlay.deselectCell(this.gameState.selected);
          // this.gameState.selected = null;
          console.log('команда компа после удаления:', this.state.teamComputer);
          // this.gamePlay.deselectCell(this.state.activeCell);// --------------
          this.checkState();// проверка уровня и состояния игры
        }
        /* else {
          this.gamePlay.selectCell(this.state.activeCell, 'yellow');
        }
        */

        this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
        // this.gamePlay.selectCell(this.state.activeCell, 'yellow');???
        // end
        //  this.checkState();// проверка уровня и состояния игры
        this.transferComp();
        // this.checkState();// проверка уровня и состояния игры
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
      // переход хода
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
    // console.log('this+index enter', this, index, character);
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
    // console.log('this+index leave', this, index);
    // this.gamePlay.setCursor(cursors.pointer);
    if (this.getCharacter(index)) { // eсть персонаж
      this.gamePlay.hideCellTooltip(index);
    } else {
      this.gamePlay.deselectCell(index); // пустая клетка
      // this.gamePlay.setCursor(cursors.pointer);
    }
    if (this.getCharacter(index) && !this.isCharInTeam(index)) {
      // eсть персонаж  и он персонаж противника, то убрать красный
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.setCursor(cursors.auto);
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
    console.log('loading пробуем извлечь', GameState.from(this.state), GameState.from(this.state));
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
      }

      if (!leftBorder.includes(idx - (n - 1))) {
      // if (!leftBorder.includes(idx - 1)) {
        // левая сторона от числа
        points.push(idx - n);
        points.push(idx - (b * n + n));
        points.push(idx + (b * n - n));

        for (let j = 1; j <= n - 1; j += 1) {
        // if (n <= char - 1){
          points.push(idx + (b - 1) * n - b * j);
          points.push(idx - (b + 1) * n + b * j);

          points.push(idx + (b - 1) * n + j);
          points.push(idx - (b + 1) * n + j);
        }
      }
      /* else if (!topBorder.includes(idx - (n - 1) - b)) {
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
      */

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
      } /*
      else if (!topBorder.includes(idx + (n - 1) - b)) {
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
      */
    }
    return points.filter((elem) => elem >= 0 && elem <= (b ** 2 - 1));
  }

  checkAllowPoints(idx, charCharacter) { // charCharacter = атака или дистанция
    const allowPoints = this.calcPoints(this.state.activeCell, charCharacter);
    const value = allowPoints.includes(idx);
    console.log('все теоретически допустимые перемещения/атака\n', allowPoints, value);
    return value;
  }

  deleteChar(index) { // index - инд элемента в позиционном массиве!!!
    // тоже , что результат getCharIndex(idx)
    /*
    const number = this.state.ArrayOfPositionCharacter
      .indexOf(this.getCharacter(index));
    this.state.ArrayOfPositionCharacter.splice(number, 1);
    */
    this.state.ArrayOfPositionCharacter.splice(index, 1);
    // console.log('array position new', this.state.ArrayOfPositionCharacter, index);
    this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
  }

  async transferComp() {
    const oldactive = this.state.activeCell;
    const oldPlayer = this.state.activePlayer;

    this.state.activeTeam = this.state.teamComputer;
    console.log('меняем актив команду', this.state.activeTeam);
    // const arr = this.state.activeTeam.toArray();
    const arrUser = this.state.teamUser.toArray();
    const sum = this.state.ArrayOfPositionCharacter.length;
    const idxInTeam = getRandomInt(arrUser.length, sum - 1);
    console.log('инд противника в масс ArrayOfPositionCharacter ', idxInTeam);
    const { character, position } = this.state.ArrayOfPositionCharacter[idxInTeam];

    this.state.activePlayer = this.getCharacter(position).character;
    this.state.activeCell = position;

    // выбрали игрока компьютера
    console.log('игрок противника', position, character.type, this.state.ArrayOfPositionCharacter[idxInTeam]);
    console.log('лицо игрока противника', this.state.activePlayer);
    // возможна ли атака? если да, атакуем, нет - перемещаемся
    //
    let attack = this.state.ArrayOfPositionCharacter[0].position;
    // если на нулевом месте не юзер персон?
    for (let j = 1; j < this.state.teamUser.toArray().length; j += 1) {
      if ((this.state.ArrayOfPositionCharacter[j].position - position) <= (attack - position)) {
        attack = this.state.ArrayOfPositionCharacter[j].position;
      }
    }
    const allowPoints = this.calcPoints(position, this.state.activePlayer.attackDistance);
    //  allowPoints не проверяем на допустимость , т.к. дальше на этом строится проверка!!!
    const allowPoints2 = this.checkAllow(this.calcPoints(position,
      this.state.activePlayer.distance));
    // allowPoints2 надо исключить позиции занятые другими игроками!!!!

    const value = allowPoints.includes(attack);
    if (value) {
      // если есть активный персонаж, а клик на песонаже противника =
      //  проверка возможна ли  атака&
      console.log('возможна атака, т.к есть персонаж в зоне атаки\n value', value);
      console.log('массив для атаки\n', allowPoints);
      const personAttacker = character;
      const target = this.getCharacter(attack).character;
      console.log('команда юзерс персон', this.state.teamUser);
      console.log('цель среди юзерс персон', target);
      const damage = Math.max(personAttacker.attack - target.defence,
        personAttacker.attack * 0.1).toFixed();
      await this.gamePlay.showDamage(attack, damage);
      console.log('атака прошла урон:', damage);
      target.health -= damage;
      //  урон критичен
      if (target.health <= 0) {
        console.log(' удаляем этот элемент в позиционном массиве:', this.getCharIndex(attack));
        this.deleteChar(this.getCharIndex(attack));// удаляем в общем массиве
        this.state.teamUser.delete(target); //
        console.log('команда юзера после удаления:', this.state.teamUser);

        if (attack === oldactive) { // снять выбор активного у юзера
          this.gamePlay.deselectCell(oldactive);
          this.state.activeCell = -1;
          this.state.activePlayer = undefined;
          this.state.activeTeam = this.state.teamUser;
        }
        // после удаления команда юзера пуста
        this.checkState();// проверка уровня и состояния игры
      }
      this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
      /*
      if (this.state.activeCell !== -1) {
        this.gamePlay.selectCell(oldactive, 'yellow');
      }
      */
    } else {
      // GamePlay.showError('играет компьютер!Атака не возможна!!!');// делаем перемещение
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
    if (this.state.activeCell !== -1) {
      this.state.activeCell = oldactive;
      this.state.activePlayer = oldPlayer;
    }
    // this.gamePlay.selectCell(this.state.activeCell, 'yellow');
    // return { character, position };
    //
  }

  onNextLevelGame() {
    switch (this.state.level) {
      case 2:
        this.state.characterCount = 1;
        break;
      case 3:
        this.state.characterCount = 2;
        break;
      case 4:
        this.state.characterCount = 2;
        break;
      default:
        break;
    }

    this.state.activePlayer = undefined;
    this.state.ArrayOfPositionCharacter = []; // обнуляем здесь или в this.initGameDraw();
    this.state.activeCell = -1;

    this.gamePlay.drawUi(themes[`level${this.state.level}`]);
    this.initGameDraw();
    this.state.activeTeam = this.state.teamUser;
    this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
    GamePlay.showMessage(`Level ${this.state.level}`);
  }

  newLevel() {
    // this.state.level += 1;
    let string = '';
    if (this.state.level === 4) {
      console.log('Игра окончена');
      if (this.state.teamUser.members.size === 0) {
        string += 'Игра окончена. Поражение!';
      } else {
        string += 'Победа!!!';
      }
      GamePlay.showMessage(`${string}\nКол-во набранных очков: ${this.scopeSum()}\n
      Максимальное число очков: ${Math.max(...this.state.scope)}`);
      // заблокировать как ? снять обработчики?
      this.endGame();
    } else if (this.state.level < 4 && this.state.teamUser.members.size !== 0) { // играем дальше
      string = `Уровень ${this.state.level} пройден. Играем дальше!`;
      GamePlay.showMessage(`${string}\nКол-во набранных очков: ${this.scopeSum()}\n
      Максимальное число очков: ${Math.max(...this.state.scope)}`);
      this.state.level += 1;
      this.state.teamUser.members.forEach((char) => char.levelUp());
      this.onNextLevelGame();
    } else {
      string = 'Игра окончена. Поражение!';
      GamePlay.showMessage(`${string}\nКол-во набранных очков: ${this.scopeSum()}\n
      Максимальное число очков: ${Math.max(...this.state.scope)}`);
      this.endGame();
    }
  }

  checkState() {
    // 'новый уровень/ или конец'
    if (this.state.teamUser.members.size === 0 || this.state.teamComputer.members.size === 0) {
      // this.gamePlay.deselectCell(this.state.activeCell);
      this.newLevel();
    }
  }

  checkAllow(array) {
    // console.log('массив до проверки и исключения', array);
    if (array.indexOf(this.state.activeCell) !== -1) {
      array.splice(array.indexOf(this.state.activeCell), 1);
    }
    this.state.ArrayOfPositionCharacter.forEach((character) => {
      if (array.includes(character.position)) {
        array.splice(array.indexOf(character.position), 1);
      }
    });
    // console.log('массив после проверки и исключения', array);
    return array;
  }

  scopeSum() {
    let sum = 0;
    sum += this.state.teamUser.toArray().reduce((a, b) => a + b.health, 0);
    this.state.scope.push(sum);
    console.log('на уровне набрано очков:', sum);
    return sum;
  }

  endGame() {
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.newGameListeners = [];
    this.gamePlay.saveGameListeners = [];
    this.gamePlay.loadGameListeners = [];
    // this.gamePlay = new GamePlay();
    this.state.ArrayOfPositionCharacter = [];
    this.gamePlay.redrawPositions(this.state.ArrayOfPositionCharacter);
  }
}
