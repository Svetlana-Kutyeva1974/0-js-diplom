import Character from './Character.js';

export default class Swordsman extends Character {
  constructor(...args) {
    super(...args);
    this.attack = 40;
    this.defence = 10;
    this.distance = 4;
    this.attackDistance = 1;
  }
}
