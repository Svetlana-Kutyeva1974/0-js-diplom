import { calcTileType, calcHealthLevel } from '../utils.js';

test.each([
  [0, 'top-left'],
  [4, 'top'],
  [7, 'top-right'],
  [15, 'right'],
  [16, 'left'],
  [20, 'center'],
  [63, 'bottom-right'],
  [56, 'bottom-left'],
  [58, 'bottom'],
])(
  'Проверка возвращаемых строк',
  (number, expected) => {
    expect(calcTileType(number, 8)).toBe(expected);
  },
);

test.each([
  [5, 'critical'],
  [40, 'normal'],
  [70, 'high'],
])(
  'Проверка возвращаемых значений health',
  (health, expected) => {
    expect(calcHealthLevel(health)).toBe(expected);
  },
);
