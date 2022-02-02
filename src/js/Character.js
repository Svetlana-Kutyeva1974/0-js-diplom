export default class Character {
  /*
  static TYPES = {
    bowman: [25, 25],
    swordsman: [40, 10],
    magician: [10, 40],
    daemon: [10, 40],
    undead: [40, 10],
    vampire: [25, 25],
  }
  */
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    if (new.target.name === 'Character') {
      throw new Error('user use "new Character()"');
    }
    // TODO: throw error if user use "new Character()"
  }

  levelUp() {
    if (this.health !== 0) {
      this.level += 1;
      // this.attack = Math.max(this.attack, this.attack * ((1.8 - this.health) / 100));
      // this.defence += 0.2 * this.defence;
      this.attack = Math.max(this.attack,
        +(this.attack * (1.8 - (1 - this.health / 100))).toFixed());
      // this.defence = Math.max(this.defence, this.defence * ((1.8 - this.health) / 100));
      this.defence = Math.max(this.attack,
        +(this.attack * (1.8 - (1 - this.health / 100))).toFixed());
      this.health += 80;
      if (this.health >= 100) {
        this.health = 100;
      }
    } else {
      throw new Error('Нельзя повысить уровень умершего');
    }
  }

  damage(points) {
    if (this.health >= 0) {
      this.health -= points * (1 - this.defence / 100).toFixed();
    } else {
      throw new Error('Ошибка, уровень жизни игрока меньше нуля');
    }
  }
}
