export function calcTileType(index, boardSize) {
  // TODO: write logic here
  let stringOfboard = '';
  if (index === 0) {
    stringOfboard = 'top-left';
  } else if (index === 7) {
    stringOfboard = 'top-right';
  } else if (index === 56) {
    stringOfboard = 'bottom-left';
  } else if (index === 63) {
    stringOfboard = 'bottom-right';
  } else if (index > 0 && index < boardSize) {
    stringOfboard = 'top';
  } else if (index > boardSize ** 2 - boardSize && index < boardSize ** 2 - 1) {
    stringOfboard = 'bottom';
  } else if (index % 2 === 1 && index % 8 === 7) {
    stringOfboard = 'right';
  } else if (index % 2 === 0 && index % 8 === 0) {
    stringOfboard = 'left';
  } else {
    stringOfboard = 'center';
  }
  return stringOfboard;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
