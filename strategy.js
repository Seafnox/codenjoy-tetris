let Element = {
  // из этих символов состоит строка glass
  EMPTY: ' ', // так выглядит свободное место в стакане
  BUSY: '*', // а тут уже занято
  OWN: '0',
};

let FIGURES = {
  O: "O",
  I: "I",
  L: "L",
  J: "J",
  S: "S",
  Z: "Z",
  T: "T",
};

let COMMANDS = {
  LEFT: "left",
  RIGHT: "right",
  DROP: "drop",
  DO_NOT_ROTATE: "rotate=0",
  ROTATE_90: "rotate=1",
  ROTATE_180: "rotate=2",
  ROTATE_270: "rotate=3",
};

const GLASS_HEIGHT = 20;
const GLASS_WIDTH = 10;

// метод, говорящий что делать той или иной фигурке figure с координарами x,y в стакане glass. next - очередь следущих фигурок
let answer = (figure, x, y, glass, next) => {
    console.log('MESSAGE: ' + JSON.stringify({figure, x, y, next}));

    const newGlass = updateGlassByFigure(figure, +x, +y, glass);

    console.log('GLASS:\n' + prepareGlass(newGlass));

    // add "drop" to response when you need to drop a figure
  // for details please check http://codenjoy.com/portal/?p=170#commands
  return strategyByFigure(figure, x, y, glass);
};

function prepareGlass(glass) {
  let result = [];
  for(let i = 0; i < GLASS_HEIGHT; i++) {
    result = [
        glass.slice(i*GLASS_WIDTH, (i+1)*GLASS_WIDTH),
        ...result,
      ];
  }

  return result.join('|\n') + '|';
}

function updateGlassByFigure(figure, x ,y, glass) {
  const figureStrategy = {
    [FIGURES.I]: updateGlassByI,
    [FIGURES.O]: updateGlassByO,
    [FIGURES.J]: updateGlassByJ,
  };
  if (!figureStrategy[figure]) {
    throw new Error('No Figure ' + figure);
  }
  return figureStrategy[figure](x, y, glass);
}

function updateGlassByO(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y-1)*GLASS_WIDTH + x)}${Element.OWN}${Element.OWN}${newGlass.substring((y-1)*GLASS_WIDTH + x + 2)}`;
    newGlass = `${newGlass.substring(0, (y)*GLASS_WIDTH + x)}${Element.OWN}${Element.OWN}${newGlass.substring((y)*GLASS_WIDTH + x + 2)}`;
    return newGlass;
}

function updateGlassByI(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y-2)*GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y-2)*GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y-1)*GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y-1)*GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y)*GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y)*GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y+1)*GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y+1)*GLASS_WIDTH + x + 1)}`;
    return newGlass;
}

function updateGlassByJ(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y+1)*GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y+1)*GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y)*GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y)*GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y-1)*GLASS_WIDTH + x - 1)}${Element.OWN}${Element.OWN}${newGlass.substring((y-1)*GLASS_WIDTH + x + 1)}`;
    return newGlass;
}

function strategyByFigure(figure, x, y, glass) {
  const figureStrategy = {
    [FIGURES.I]: strategyByI,
    [FIGURES.O]: strategyByO,
    [FIGURES.J]: strategyByJ,
  };

  if (!figureStrategy[figure]) {
    throw new Error('No strategy for ' + figure);
  }

  return figureStrategy[figure](x, y, glass);
}

function strategyByJ(x, y, glass) {
    let minAvailableLeft = GLASS_WIDTH;
    let command = COMMANDS.LEFT;
    for(let h = 0; h < GLASS_HEIGHT; h++) {
        for(let w = 1; w < GLASS_WIDTH; w++) {
            const positions = [
                (h)*GLASS_WIDTH + (w),
                (h+1)*GLASS_WIDTH + (w),
                (h+2)*GLASS_WIDTH + (w),
                (h)*GLASS_WIDTH + (w-1),
                (h+1)*GLASS_WIDTH + (w-1),
                (h+2)*GLASS_WIDTH + (w-1),
            ];
            const availablePositions = positions.filter((position) => glass[position] === Element.EMPTY);
            if (availablePositions.length === positions.length) {
                let pathClean1 = isEmptyPath(w, h, glass);
                let pathClean2 = isEmptyPath(w-1, h, glass);

                if (!pathClean1 || !pathClean2) {
                    continue;
                }
                minAvailableLeft = w;
                break;
            }
        }
        if (minAvailableLeft < GLASS_WIDTH) {
            break;
        }
    }

    let changeXBy = x - minAvailableLeft;

    if (changeXBy < 0) {
        command = COMMANDS.RIGHT;
        changeXBy = -changeXBy;
    }

    return `${command}=${changeXBy}, ${COMMANDS.DROP}`;
}

function strategyByI(x, y, glass) {
    let minAvailableLeft = GLASS_WIDTH;
    let command = COMMANDS.LEFT;
    for(let h = 0; h < GLASS_HEIGHT; h++) {
        for(let w = 0; w < GLASS_WIDTH; w++) {
            const positions = [
                (h)*GLASS_WIDTH + (w),
                (h+1)*GLASS_WIDTH + (w),
                (h+2)*GLASS_WIDTH + (w),
                (h+3)*GLASS_WIDTH + (w),
            ];
            const availablePositions = positions.filter((position) => glass[position] === Element.EMPTY);
            if (availablePositions.length === positions.length) {
                let pathClean = isEmptyPath(w, h, glass);

                if (!pathClean) {
                  continue;
                }

                minAvailableLeft = w;
                break;
            }
        }
        if (minAvailableLeft < GLASS_WIDTH) {
            break;
        }
    }

    let changeXBy = x - minAvailableLeft;

    if (changeXBy < 0) {
        command = COMMANDS.RIGHT;
        changeXBy = -changeXBy;
    }

    return `${command}=${changeXBy}, ${COMMANDS.DROP}`;
}

function strategyByO(x, y, glass) {
  let minAvailableLeft = GLASS_WIDTH;
  let command = COMMANDS.LEFT;
  for(let h = 0; h < GLASS_HEIGHT; h++) {
    for(let w = 0; w < GLASS_WIDTH; w++) {
      const positions = [
          (h)*GLASS_WIDTH + (w),
          (h+1)*GLASS_WIDTH + (w),
          (h)*GLASS_WIDTH + (w+1),
          (h+1)*GLASS_WIDTH + (w+1),
        ];
      const availablePositions = positions.filter((position) => glass[position] === Element.EMPTY);
      if (availablePositions.length === positions.length) {
          let pathClean1 = isEmptyPath(w, h, glass);
          let pathClean2 = isEmptyPath(w+1, h, glass);

          if (!pathClean1 || !pathClean2) {
              continue;
          }

          minAvailableLeft = w;
        break;
      }
    }
    if (minAvailableLeft < GLASS_WIDTH - 1) {
      break;
    }
  }

    let changeXBy = x - minAvailableLeft;

  if (changeXBy < 0) {
    command = COMMANDS.RIGHT;
    changeXBy = -changeXBy;
  }

  return `${command}=${changeXBy}, ${COMMANDS.DROP}`;
}

function isEmptyPath(x, y, glass) {
    let pathClean = true;
    for (let h1 = y; h1 < GLASS_HEIGHT; h1++) {
        if (glass[(h1)*GLASS_WIDTH + (x)] !== Element.EMPTY) {
            pathClean = false;
            break;
        }
    }
    return pathClean;
}

module.exports = answer;
