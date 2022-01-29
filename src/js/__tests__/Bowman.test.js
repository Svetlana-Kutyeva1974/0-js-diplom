/*
test('string length name error', () => {
  const result = new Bowman('hero', 'Bowman');
  expect(result.attack).toBe(Character.TYPES[`${result.type}`][0]);
});

test('string length name error', () => {
  const result0 = new Bowman('hero', 'Bowman');
  expect(result0.defence).toBe(Character.TYPES[`${result0.type}`][1]);
});

test('Повышение уровня умершего персонажа. Ошибка', () => {
  expect(() => {
    const result = new Bowman('hero', 'Bowman');
    result.health = 0;
    result.levelUp();
  }).toThrow('Нельзя повысить уровень умершего');
});

test('Повышение уровня персонажа', () => {
  const result = new Bowman('hero', 'Bowman');
  result.health = 80;
  result.levelUp();
  const expected = {
    name: 'hero',
    type: 'Bowman',
    health: 100,
    level: 2,
    attack: 30,
    defence: 30,
  };
  expect(result).toEqual(expected);
});

test('damage уменьшение здоровья персонажа', () => {
  const heroes = new Bowman('hero', 'Bowman');
  heroes.damage(65);
  const result = heroes.health;
  expect(result).toBeCloseTo(51.25);
});
*/
