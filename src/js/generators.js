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
import Magician from './Magician.js';
import Daemon from './Daemon.js';
import Vampire from './Vampire.js';

const characterType = ['Bowman', 'Swordsman', 'Undead', 'Magician', 'Daemon', 'Vampire'];

export function* generateSequence(start, end, step) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

export function* generateFromSequence(min, max) {
  yield* generateSequence(min, max - 1, 8);
  yield* generateSequence(min + 1, max, 8);
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function* characterGenerator(allowedTypes, maxLevel) {
  for (let i = 0; i <= maxLevel; i += 1) {
    const random = getRandomInt(0, allowedTypes.length - 1);
    const className = `${allowedTypes[random]}`;
    console.log('игрок : random, тип ', random, className);
    yield new allowedTypes[random](maxLevel, characterType[random].toLowerCase());
  }
}

export function generateTeam(allowedTypes, maxLevel = 1, characterCount = 4) {
  const team = new Team();
  const forUser = characterGenerator(allowedTypes, maxLevel);
  const forComputer = characterGenerator([Bowman,
    Swordsman, Undead, Magician, Daemon, Vampire], maxLevel);
  for (const value of forUser) {
    console.log('генерируем для юзера', value);
    team.add(value);
  }
  for (const value of forComputer) {
    console.log('генерируем для компа', value);
    team.add(value);
  }
  return team;
}

export function generateArray(start, end, step = 8) {
  const array = [];
  const forArray = generateFromSequence(start, end, step);
  for (const value of forArray) {
    console.log('генерируем массив', value);
    array.push(value);
  }
  return array;
}
