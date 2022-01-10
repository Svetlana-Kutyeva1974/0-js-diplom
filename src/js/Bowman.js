import Character from './Character.js';

export default class Bowman extends Character {
  constructor(...args) {
    super(...args);
    this.attack = 25;
    this.defence = 25;
    this.distance = 2;
    this.attackDistance = 2;
  }
}
