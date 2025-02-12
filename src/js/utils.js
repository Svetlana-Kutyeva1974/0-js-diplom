export function calcTileType(index, boardSize) {
  // TODO: write logic here
  let stringOfboard = '';
  if (index === 0) {
    stringOfboard = 'top-left';
  } else if (index === boardSize - 1) {
    stringOfboard = 'top-right';
  } else if (index === boardSize ** 2 - boardSize) {
    stringOfboard = 'bottom-left';
  } else if (index === boardSize ** 2 - 1) {
    stringOfboard = 'bottom-right';
  } else if (index > 0 && index < boardSize) {
    stringOfboard = 'top';
  } else if (index > boardSize ** 2 - boardSize && index < boardSize ** 2 - 1) {
    stringOfboard = 'bottom';
  } else if (index % 2 === 1 && index % boardSize === boardSize - 1) {
    stringOfboard = 'right';
  } else if (index % 2 === 0 && index % boardSize === 0) {
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
