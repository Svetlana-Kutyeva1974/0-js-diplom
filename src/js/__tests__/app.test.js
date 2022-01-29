// import Character from '../Character.js';
import Bowman from '../Bowman.js';
import Daemon from '../Daemon.js';
import Magician from '../Magician.js';
import Swordsman from '../Swordsman.js';
import Undead from '../Undead.js';
import Vampire from '../Vampire.js';
/*
test('При попытке создать новый объект класса Character выбрасывается ошибка', () => {
  expect(() => new Character(1)).toThrowError(new Error('create objects of the Character class'));
});
*/
test.each([
  [new Bowman(1)],
  [new Daemon(1)],
  [new Magician(1)],
  [new Swordsman(1)],
  [new Undead(1)],
  [new Vampire(1)],
])(
  ('Не должно быть выброса ошибки'), (char) => {
    expect(() => char).not.toThrow();
  },
);

/*
test('app type error ', () => {
  expect(() => {
    // eslint-disable-next-line no-unused-vars
    const result3 = new Character('hero5', 'Magiciancheck');
  }).toThrow(/Ошибка, недопустимый тип элемента/);
});

test('level health error', () => {
  expect(() => {
    const result3 = new Character('hero8', 'Bowman');
    result3.health = 0;
    result3.levelUp();
  }).toThrow(/Нельзя повысить уровень умершего/);
});

test('level domage error', () => {
  const result3 = new Character('hero8', 'Bowman');
  result3.health = -1;
  expect(() => {
    result3.damage(2000);
  }).toThrow(/Ошибка, уровень жизни игрока меньше нуля/);
});
*/
