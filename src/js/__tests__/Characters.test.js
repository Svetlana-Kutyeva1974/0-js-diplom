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
*/
test('level up вычисление параметров1', () => {
  const result = new Bowman(1);
  result.health = 50;
  result.levelUp();
  expect(result.level).toBe(2);
});

test('level up вычисление параметров2', () => {
  const result = new Bowman(1);
  result.health = 50;
  result.levelUp();
  expect(result.attack).toBe(Math.max(25,
    +(25 * (1.8 - (1 - 50 / 100))).toFixed()));
});

test('level up вычисление параметров2', () => {
  const result = new Bowman(1);
  result.health = 150;
  result.levelUp();
  expect(result.health).toBe(100);
});

test('level up вычисление параметров2', () => {
  const result = new Bowman(1);
  result.health = 10;
  result.levelUp();
  expect(result.health).toBe(90);
});

test('damage вычисление', () => {
  const result = new Bowman(1);
  result.health = 50;
  result.damage(10);
  expect(result.health).toBe(40);
});
/*
test.each([
  [10, 40],
  [40, 50 - 40 * (1 - 25 / 100).toFixed()],
  [5, 50 - 5 * (1 - 25 / 100).toFixed()],
])(
  'Проверка возвращаемых значений health',
  (point, expected) => {
    expect(new Bowman(1).damage(point)).toEqual(expected);
  },
);this.attack = Math.max(25,
        +(25 * (1.8 - (1 - this.health / 100))).toFixed());
*/
