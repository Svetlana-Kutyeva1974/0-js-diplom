/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import Team from './Team.js';

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
  let level = maxLevel;
  const random = getRandomInt(0, allowedTypes.length - 1);
  const className = `${allowedTypes[random]}`;
  console.log('игрок : random, тип ', random, className);
  if (maxLevel > 1) {
    level = getRandomInt(1, maxLevel);
  }
  yield new allowedTypes[random](level, characterType[random].toLowerCase());
}

export function generateTeam(allowedTypes, maxLevel = 1, characterCount = 2) {
  const team = new Team();
  for (let i = 0; i < characterCount; i += 1) {
    console.log(`генерируем в кол-ве${characterCount}`, characterGenerator(allowedTypes, maxLevel).next().value);
    team.add(characterGenerator(allowedTypes, maxLevel).next().value);
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
