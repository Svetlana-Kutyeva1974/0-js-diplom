import Character from './Character.js';

export default class Vampire extends Character {
  constructor(...args) {
    super(...args);
    this.attack = Character.TYPES[`${this.type}`][0];
    this.defence = Character.TYPES[`${this.type}`][1];
  }
}
