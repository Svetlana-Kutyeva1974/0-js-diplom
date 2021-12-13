import Character from './Character.js';

export default class Swordsman extends Character {
  constructor(...args) {
    super(...args);
    this.attack = Character.TYPES[`${this.type}`][0];
    this.defence = Character.TYPES[`${this.type}`][1];
    this.distance = 4;
    this.attackDistance = 1;
  }
}
