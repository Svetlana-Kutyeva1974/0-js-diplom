/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import Team from './Team.js';
import Bowman from './Bowman.js';
import Swordsman from './Swordsman.js';
import Undead from './Undead.js';

const characterType = ['Bowman', 'Swordsman', 'Undead', 'Magician', 'Daemon', 'Vampire'];

/*
import Character from './Character.js';
const array1 = Object.keys(Character.TYPES)[0];
const array2 = Object.keys(Character.TYPES)[1];
*/
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function* characterGenerator(allowedTypes = [Bowman, Swordsman], maxLevel) {
  for (let i = 0; i <= maxLevel; i += 1) {
    const random = getRandomInt(maxLevel + 1);
    const className = `${allowedTypes[i * random]}`;
    console.log('игрок ', random, className, allowedTypes[i * random]);
    /*
    yield new allowedTypes[i * random](`${count}${characterType
      [i * random]}${i}`, characterType[i * random]);
    */
    yield new allowedTypes[i * random](maxLevel, characterType[i * random].toLowerCase());
  }
  // TODO: write logic here
}

export function generateTeam(allowedTypes = [Bowman, Swordsman], maxLevel = 1, characterCount) {
  // TODO: write logic here
  const team = new Team();
  const forUser = characterGenerator(allowedTypes, maxLevel);
  const forComputer = characterGenerator([Bowman, Swordsman], maxLevel);
  for (const value of forUser) {
    console.log('генерируем', value);
    team.add(value);
  }
  for (const value of forComputer) {
    console.log('генерируем для компа', value);
    team.add(value);
  }
  /*
    for (let i = 0; i < characterCount - 1; i += 1) {
    const character = new allowedTypes[getRandomInt(allowedTypes.length)]('hero', 'Magician');
    team.add(character);
    }
    */
  return team;
}
