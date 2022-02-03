import Character from '../Character.js';
import Bowman from '../Bowman.js';

test('Created Bowman class', () => {
  expect(new Bowman(1, 'bowman')).toEqual({
    type: 'bowman',
    health: 50,
    level: 1,
    attack: 25,
    defence: 25,
    attackDistance: 2,
    distance: 2,
  });
});

test('Created Character class', () => {
  expect(() => new Character(1)).toThrowError(new Error('user use "new Character()"'));
});

test('level health error', () => {
  expect(() => {
    const result = new Bowman(1, 'bowman');
    result.health = 0;
    result.levelUp();
  }).toThrow(/Нельзя повысить уровень умершего/);
});

test('level health error', () => {
  expect(() => {
    const result = new Bowman(1);
    result.health = -10;
    result.damage(10);
  }).toThrow(/Ошибка, уровень жизни игрока меньше нуля/);
});
/*
test('level up вычисление параметров1', () => {
  expect(() => {
    const result = new Bowman(1);
    result.health = 110;
    result.levelUp();
  }).toEqual({
    type: 'bowman',
    health: 100,
    level: 2,
    attack: 25,
    defence: 25,
    attackDistance: 2,
    distance: 2,
  });
});

test('level up вычисление параметров1', () => {
  expect(() => {
    const result = new Bowman(1);
    result.health = 10;
    result.levelUp();
  }).toEqual({
    type: 'bowman',
    health: 100,
    level: 2,
    attack: 25,
    defence: 25,
    attackDistance: 2,
    distance: 2,
  });
});

test('damage вычисление', () => {
  expect(() => {
    const result = new Bowman(1);
    result.health = 10;
    result.damage();
  }).toEqual({
    type: 'bowman',
    health: 100,
    level: 2,
    attack: 25,
    defence: 25,
    attackDistance: 2,
    distance: 2,
  });
});
*/
