import Character from './Character.js';

export default class Undead extends Character {
  constructor(...args) {
    super(...args);
    this.attack = 40;
    this.defence = 10;
    this.distance = 1;
    this.attackDistance = 4;
  }
}
