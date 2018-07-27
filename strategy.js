/**
 *
 *
 * Этот трэш я сделал за 4 часа
 * Здесь куча кода без оптимизации.
 * Я даже не пытался его оптимизировать.
 * Это нормально для 4 часов работы.
 * Только боль, только хардкор!
 *
 *
 *
 */

let Element = {
    // из этих символов состоит строка glass
    EMPTY: ' ', // так выглядит свободное место в стакане
    BUSY: '*', // а тут уже занято
    OWN: '0',
};

const FIGURES = {
    O: 'O',
    I: 'I',
    L: 'L',
    J: 'J',
    S: 'S',
    Z: 'Z',
    T: 'T',
};

const PATTERNS = {
    [FIGURES.O] : [
        ['*','*'],
        ['*','*'],
    ],
    [FIGURES.I]: [
        ['*'],
        ['*'],
        ['*'],
        ['*'],
    ],
    [FIGURES.J]: [
        [' ','*'],
        [' ','*'],
        ['*','*'],
    ],
    [FIGURES.L]: [
        ['*',' '],
        ['*',' '],
        ['*','*'],
    ],
    [FIGURES.S]: [
        [' ','*','*'],
        ['*','*',' '],
    ],
    [FIGURES.Z]: [
        ['*','*',' '],
        [' ','*','*'],
    ],
    [FIGURES.T]: [
        ['*','*','*'],
        [' ','*',' '],
    ],
};

const COMMANDS = {
    LEFT: 'left',
    RIGHT: 'right',
    DROP: 'drop',
    DO_NOT_ROTATE: 'rotate=0',
    ROTATE_90: 'rotate=1',
    ROTATE_180: 'rotate=2',
    ROTATE_270: 'rotate=3',
};

const ROTATIONS = {
    DO_NOT_ROTATE: 0,
    ROTATE_90: 1,
    ROTATE_180: 2,
    ROTATE_270: 3,
};

const makeDrop = true;

const GLASS_HEIGHT = 20;
const GLASS_WIDTH = 10;

// метод, говорящий что делать той или иной фигурке figure с координарами x,y в стакане glass. next - очередь следущих фигурок
let answer = (figure, x, y, glass, next) => {
    console.log('MESSAGE: ' + JSON.stringify({figure, x, y, next}));

    // const newGlass = updateGlassByFigure(figure, +x, +y, glass);
    //
    // console.log('GLASS:\n' + prepareGlass(newGlass));

    // add "drop" to response when you need to drop a figure
    // for details please check http://codenjoy.com/portal/?p=170#commands
    const strategyData = strategyByFigure(figure, x, y, glass);

    let changeXBy = x - strategyData.offset;
    let command = COMMANDS.LEFT;

    if (changeXBy < 0) {
        command = COMMANDS.RIGHT;
        changeXBy = -changeXBy;
    }

    if (y < GLASS_HEIGHT - 1) {
        strategyData.rotate = null;
    }

    const strategyCommands = [
        strategyData.rotate ? `rotate=${strategyData.rotate}` : null,
        `${command}=${changeXBy}`,
        makeDrop && !strategyData.doNotDrop || y < 15 ? COMMANDS.DROP : null,
    ];

    return strategyCommands.filter(command => !!command).join(', ');
};

function prepareGlass(glass) {
    let result = [];
    for (let i = 0; i < GLASS_HEIGHT; i++) {
        result = [
            glass.slice(i * GLASS_WIDTH, (i + 1) * GLASS_WIDTH),
            ...result,
        ];
    }

    return result.join('|\n') + '|';
}

function updateGlassByFigure(figure, x, y, glass) {
    const figureStrategy = {
        [FIGURES.I]: updateGlassByI,
        [FIGURES.O]: updateGlassByO,
        [FIGURES.J]: updateGlassByJ,
        [FIGURES.L]: updateGlassByL,
        [FIGURES.S]: updateGlassByS,
        [FIGURES.Z]: updateGlassByZ,
        [FIGURES.T]: updateGlassByT,
    };
    if (!figureStrategy[figure]) {
        throw new Error('No Figure ' + figure);
    }
    return figureStrategy[figure](x, y, glass);
}

function updateGlassByO(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y - 1) * GLASS_WIDTH + x)}${Element.OWN}${Element.OWN}${newGlass.substring((y - 1) * GLASS_WIDTH + x + 2)}`;
    newGlass = `${newGlass.substring(0, (y) * GLASS_WIDTH + x)}${Element.OWN}${Element.OWN}${newGlass.substring((y) * GLASS_WIDTH + x + 2)}`;
    return newGlass;
}

function updateGlassByI(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y - 2) * GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y - 2) * GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y - 1) * GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y - 1) * GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y) * GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y) * GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y + 1) * GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y + 1) * GLASS_WIDTH + x + 1)}`;
    return newGlass;
}

function updateGlassByJ(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y + 1) * GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y + 1) * GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y) * GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y) * GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y - 1) * GLASS_WIDTH + x - 1)}${Element.OWN}${Element.OWN}${newGlass.substring((y - 1) * GLASS_WIDTH + x + 1)}`;
    return newGlass;
}

function updateGlassByL(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y + 1) * GLASS_WIDTH + x - 1)}${Element.OWN}${Element.OWN}${newGlass.substring((y + 1) * GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y) * GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y) * GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y - 1) * GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y - 1) * GLASS_WIDTH + x + 1)}`;
    return newGlass;
}

function updateGlassByS(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y + 1) * GLASS_WIDTH + x)}${Element.OWN}${Element.OWN}${newGlass.substring((y + 1) * GLASS_WIDTH + x + 2)}`;
    newGlass = `${newGlass.substring(0, (y) * GLASS_WIDTH + x - 1)}${Element.OWN}${Element.OWN}${newGlass.substring((y) * GLASS_WIDTH + x + 1)}`;
    return newGlass;
}

function updateGlassByZ(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y + 1) * GLASS_WIDTH + x - 1)}${Element.OWN}${Element.OWN}${newGlass.substring((y + 1) * GLASS_WIDTH + x + 1)}`;
    newGlass = `${newGlass.substring(0, (y) * GLASS_WIDTH + x)}${Element.OWN}${Element.OWN}${newGlass.substring((y) * GLASS_WIDTH + x + 2)}`;
    return newGlass;
}

function updateGlassByT(x, y, glass) {
    let newGlass = glass.slice(0);
    newGlass = `${newGlass.substring(0, (y + 1) * GLASS_WIDTH + x - 1)}${Element.OWN}${Element.OWN}${Element.OWN}${newGlass.substring((y + 1) * GLASS_WIDTH + x + 2)}`;
    newGlass = `${newGlass.substring(0, (y) * GLASS_WIDTH + x)}${Element.OWN}${newGlass.substring((y) * GLASS_WIDTH + x + 1)}`;
    return newGlass;
}

function strategyByFigure(figure, x, y, glass) {
    const figureStrategy = {
        [FIGURES.I]: strategyByI,
        [FIGURES.O]: strategyByO,
        [FIGURES.J]: strategyByJ,
        [FIGURES.L]: strategyByL,
        [FIGURES.S]: strategyByS,
        [FIGURES.Z]: strategyByZ,
        [FIGURES.T]: strategyByT,
    };

    if (!figureStrategy[figure]) {
        throw new Error('No strategy for ' + figure);
    }

    return figureStrategy[figure](x, y, glass);
}

function strategyByO(x, y, glass) {
    const nearest1 = findNearOffsetInGlass(glass, strategyByO1);
    const nearest2 = findNearOffsetInGlass(glass, strategyByO2);

    if (nearest1) {
        return {
            offset: nearest1.x,
        }
    }

    if (nearest2) {
        return {
            offset: nearest2.x,
        }
    }

    return {
        offset: 0,
    }
}

function strategyByO1(x, y, glass) {
    if (x === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (y) * GLASS_WIDTH + (x),
        (y) * GLASS_WIDTH + (x + 1),
    ];

    const bsyPos = [
        (y-1) * GLASS_WIDTH + (x),
        (y-1) * GLASS_WIDTH + (x + 1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);

    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(x, y, glass);
    let pathClean2 = isEmptyPath(x + 1, y, glass);

    return pathClean1 && pathClean2;
}

function strategyByO2(x, y, glass) {
    if (x === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (y) * GLASS_WIDTH + (x),
        (y) * GLASS_WIDTH + (x + 1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);

    if (badClnPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(x, y, glass);
    let pathClean2 = isEmptyPath(x + 1, y, glass);

    return pathClean1 && pathClean2;
}

function strategyByI(x, y, glass) {
    const nearest1 = findNearOffsetInGlass(glass, strategyByI1);
    const nearest2 = findNearOffsetInGlass(glass, strategyByI2);
    const nearest3 = findNearOffsetInGlass(glass, strategyByI3);

    if (nearest2) {
        return {
            offset: nearest2.x,
        }
    }

    if (nearest1) {
        return {
            offset: nearest1.x,
        }
    }

    if (nearest3) {
        return {
            offset: nearest3.x,
        }
    }

    return {
        offset: 0,
    }
}

function strategyByI1(x,y,glass) {
    if (x === 0) {
        return false;
    }

    const clnPos = [
        (y) * GLASS_WIDTH + (x),
    ];

    const bsyPos = [
        (y) * GLASS_WIDTH + (x-1),
        (y+1) * GLASS_WIDTH + (x-1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);

    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean = isEmptyPath(x, y, glass);

    return pathClean;
}

function strategyByI2(x,y,glass) {
    if (x === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (y) * GLASS_WIDTH + (x),
    ];

    const bsyPos = [
        (y) * GLASS_WIDTH + (x+1),
        (y+1) * GLASS_WIDTH + (x+1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);

    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean = isEmptyPath(x, y, glass);

    return pathClean;
}

function strategyByI3(x,y,glass) {
    const clnPos = [
        (y) * GLASS_WIDTH + (x),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);

    if (badClnPos) {
        return false;
    }

    let pathClean = isEmptyPath(x, y, glass);

    return pathClean;
}

function strategyByJ(x, y, glass) {
    const nearestBy1 = findNearOffsetInGlass(glass, isStrategyByJ1);
    const nearestBy2 = findNearOffsetInGlass(glass, isStrategyByJ2);
    const nearestBy3 = findNearOffsetInGlass(glass, isStrategyByJ3);

    if (nearestBy2) {
        return {
            offset: nearestBy2.x,
            rotate: ROTATIONS.ROTATE_180,
        };
    }

    if (nearestBy3) {
        return {
            offset: nearestBy3.x,
            rotate: ROTATIONS.ROTATE_270,
        };
    }

    if (nearestBy1) {
        return {
            offset: nearestBy1.x,
        };
    }

    return {
        offset: GLASS_WIDTH,
    };
}

function isStrategyByJ1(w, h, glass) {
    if (w === 0) {
        return false;
    }

    const clnPos = [
        (h) * GLASS_WIDTH + (w),
        (h) * GLASS_WIDTH + (w - 1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);

    if (badClnPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(w, h, glass);
    let pathClean2 = isEmptyPath(w - 1, h, glass);

    return pathClean1 && pathClean2;
}

function isStrategyByJ2(w, h, glass) {
    if (w === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (h + 2) * GLASS_WIDTH + (w + 1),
        (h) * GLASS_WIDTH + (w),
    ];
    const bsyPos = [
        (h - 1) * GLASS_WIDTH + (w),
        (h) * GLASS_WIDTH + (w + 1),
        (h + 1) * GLASS_WIDTH + (w + 1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);
    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(w, h, glass);
    let pathClean2 = isEmptyPath(w + 1, h + 2, glass);

    return pathClean1 && pathClean2;
}

function isStrategyByJ3(x, y, glass) {
    if (x === 0 || x === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (y)*GLASS_WIDTH + x+1,
        (y+1)*GLASS_WIDTH + x,
        (y+1)*GLASS_WIDTH + x-1,
    ];

    const bsyPos = [
        (y)*GLASS_WIDTH + x,
        (y)*GLASS_WIDTH + x-1,
        (y-1)*GLASS_WIDTH + x+1,
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);
    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(x, y+1, glass);
    let pathClean2 = isEmptyPath(x+1, y, glass);
    let pathClean3 = isEmptyPath(x-1, y+1, glass);

    return pathClean1 && pathClean2 && pathClean3;
}

function strategyByL(x, y, glass) {
    const nearestBy1 = findNearOffsetInGlass(glass, isStrategyByL1);
    const nearestBy2 = findNearOffsetInGlass(glass, isStrategyByL2);
    const nearestBy3 = findNearOffsetInGlass(glass, isStrategyByL3);

    if (nearestBy2) {
        return {
            offset: nearestBy2.x,
            rotate: ROTATIONS.ROTATE_180,
        }
    }

    if (nearestBy3) {
        return {
            offset: nearestBy3.x,
            rotate: ROTATIONS.ROTATE_90,
        }
    }

    if (nearestBy1) {
        return {
            offset: nearestBy1.x,
        }
    }

    return {
        offset: 0,
    };
}

function isStrategyByL1(w, h, glass) {
    if (w === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (h) * GLASS_WIDTH + (w),
        (h) * GLASS_WIDTH + (w + 1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    if (badClnPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(w, h, glass);
    let pathClean2 = isEmptyPath(w + 1, h, glass);

    return pathClean1 && pathClean2;
}

function isStrategyByL2(w, h, glass) {
    if (w === 0) {
        return false;
    }

    const clnPos = [
        (h + 2) * GLASS_WIDTH + (w - 1),
        (h) * GLASS_WIDTH + (w),
    ];
    const bsyPos = [
        (h) * GLASS_WIDTH + (w - 1),
        (h - 1) * GLASS_WIDTH + (w),
        (h + 1) * GLASS_WIDTH + (w - 1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);
    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(w, h, glass);
    let pathClean2 = isEmptyPath(w - 1, h + 2, glass);

    return pathClean1 && pathClean2;
}

function isStrategyByL3(x, y, glass) {
    if (x === 0 || x === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (y)*GLASS_WIDTH + x-1,
        (y+1)*GLASS_WIDTH + x,
        (y+1)*GLASS_WIDTH + x+1,
    ];

    const bsyPos = [
        (y)*GLASS_WIDTH + x,
        (y)*GLASS_WIDTH + x+1,
        (y-1)*GLASS_WIDTH + x-1,
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);
    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(x, y+1, glass);
    let pathClean2 = isEmptyPath(x-1, y, glass);
    let pathClean3 = isEmptyPath(x+1, y+1, glass);

    return pathClean1 && pathClean2 && pathClean3;
}

function strategyByS(x, y, glass) {
    const nearestBy1 = findNearOffsetInGlass(glass, isStrategyByS1);
    const nearestBy2 = findNearOffsetInGlass(glass, isStrategyByS2);
    console.log('STRATEGIES', JSON.stringify({S1: nearestBy1, S2: nearestBy2}));

    if (nearestBy2) {
        return {
            offset: nearestBy2.x,
            rotate: ROTATIONS.ROTATE_90,
        };
    }

    if (nearestBy1) {
        return {
            offset: nearestBy1.x,
        }
    }

    return {
        offset: GLASS_WIDTH,
        rotate: ROTATIONS.ROTATE_90,
    };
}

function isStrategyByS1(w, h, glass) {
    if (w === 0 || w === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (h) * GLASS_WIDTH + (w - 1),
        (h) * GLASS_WIDTH + (w),
        (h + 1) * GLASS_WIDTH + (w),
        (h + 1) * GLASS_WIDTH + (w + 1),
    ];
    const bsyPos = [
        (h - 1) * GLASS_WIDTH + (w - 1),
        (h - 1) * GLASS_WIDTH + (w),
        (h) * GLASS_WIDTH + (w + 1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);
    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(w, h, glass);
    let pathClean2 = isEmptyPath(w - 1, h, glass);
    return pathClean1 && pathClean2;
}

function isStrategyByS2(w, h, glass) {
    if (w === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (h) * GLASS_WIDTH + (w+1),
        (h + 1) * GLASS_WIDTH + (w+1),
        (h + 1) * GLASS_WIDTH + (w),
        (h + 2) * GLASS_WIDTH + (w),
    ];
    const bsyPos = [
        (h) * GLASS_WIDTH + (w),
        (h-1) * GLASS_WIDTH + (w+1),
    ];
    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);
    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(w+1, h, glass);
    let pathClean2 = isEmptyPath(w, h + 1, glass);

    return pathClean1 && pathClean2;
}

function strategyByZ(x, y, glass) {
    const nearestBy1 = findNearOffsetInGlass(glass, isStrategyByZ1);
    const nearestBy2 = findNearOffsetInGlass(glass, isStrategyByZ2);

    if (nearestBy2) {
        return {
            offset: nearestBy2.x,
            rotate: ROTATIONS.ROTATE_90,
        };
    }

    if (nearestBy1) {
        return {
            offset: nearestBy1.x,
        }
    }

    return {
        offset: 0,
        rotate: ROTATIONS.ROTATE_90,
    };

}

function isStrategyByZ1(w, h, glass) {
    if (w === 0 || w === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (h) * GLASS_WIDTH + (w + 1),
        (h) * GLASS_WIDTH + (w),
        (h + 1) * GLASS_WIDTH + (w - 1),
    ];
    const bsyPos = [
        (h - 1) * GLASS_WIDTH + (w + 1),
        (h - 1) * GLASS_WIDTH + (w),
        (h) * GLASS_WIDTH + (w - 1),
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);
    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(w, h, glass);
    let pathClean2 = isEmptyPath(w + 1, h, glass);
    let pathClean3 = isEmptyPath(w - 1, h+1, glass);
    return pathClean1 && pathClean2 && pathClean3;
}

function isStrategyByZ2(w, h, glass) {
    if (w === 0) {
        return false;
    }

    const clnPos = [
        (h) * GLASS_WIDTH + (w),
        (h + 1) * GLASS_WIDTH + (w),
        (h + 1) * GLASS_WIDTH + (w+1),
        (h + 2) * GLASS_WIDTH + (w+1),
    ];
    const bsyPos = [
        (h) * GLASS_WIDTH + (w+1),
        (h - 1) * GLASS_WIDTH + (w),
    ];
    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);
    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(w, h, glass);
    let pathClean2 = isEmptyPath(w+1, h + 1, glass);

    return pathClean1 && pathClean2;
}

function strategyByT(x, y, glass) {
    const nearestBy1 = findNearOffsetInGlass(glass, isStrategyByT1);
    const nearestBy2 = findNearOffsetInGlass(glass, isStrategyByT2);
    const nearestBy3 = findNearOffsetInGlass(glass, isStrategyByT3);
    const nearestBy4 = findNearOffsetInGlass(glass, isStrategyByT4);

    if (nearestBy1) {
        return {
            offset: nearestBy1.x,
            rotate: ROTATIONS.ROTATE_180,
        };
    }

    if (nearestBy2) {
        return {
            offset: nearestBy2.x,
            rotate: ROTATIONS.ROTATE_90,
        };
    }

    if (nearestBy3) {
        return {
            offset: nearestBy3.x,
            rotate: ROTATIONS.ROTATE_270,
        };
    }

    if (nearestBy4) {
        return {
            offset: nearestBy4.x,
        };
    }
}

function isStrategyByT1(x, y, glass) {
    if (x === 0 || x === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (y)*GLASS_WIDTH + x,
        (y+1)*GLASS_WIDTH + x-1,
        (y+1)*GLASS_WIDTH + x+1,
    ];

    const bsyPos = [
        (y)*GLASS_WIDTH + x-1,
        (y)*GLASS_WIDTH + x+1,
        (y-1)*GLASS_WIDTH + x,
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);

    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(x, y, glass);
    let pathClean2 = isEmptyPath(x-1, y+1, glass);
    let pathClean3 = isEmptyPath(x+1, y+1, glass);

    return pathClean1 && pathClean2 && pathClean3;
}

function isStrategyByT2(x, y, glass) {
    if (x === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (y)*GLASS_WIDTH + x,
        (y+1)*GLASS_WIDTH + x+1,
    ];

    const bsyPos = [
        (y)*GLASS_WIDTH + x+1,
        (y-1)*GLASS_WIDTH + x,
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);

    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(x, y, glass);
    let pathClean2 = isEmptyPath(x+1, y+1, glass);

    return pathClean1 && pathClean2;
}

function isStrategyByT3(x, y, glass) {
    if (x === 0) {
        return false;
    }

    const clnPos = [
        (y+1)*GLASS_WIDTH + x-1,
        (y)*GLASS_WIDTH + x,
    ];

    const bsyPos = [
        (y-1)*GLASS_WIDTH + x,
        (y)*GLASS_WIDTH + x-1,
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);
    const badBsyPos = bsyPos.some((position) => position >= 0 && glass[position] !== Element.BUSY);

    if (badClnPos || badBsyPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(x-1, y+1, glass);
    let pathClean2 = isEmptyPath(x, y, glass);

    return pathClean1 && pathClean2;
}

function isStrategyByT4(x, y, glass) {
    if (x === 0 || x === GLASS_WIDTH) {
        return false;
    }

    const clnPos = [
        (y)*GLASS_WIDTH + x-1,
        (y)*GLASS_WIDTH + x,
        (y)*GLASS_WIDTH + x+1,
    ];

    const badClnPos = clnPos.some((position) => position >= 0 && glass[position] !== Element.EMPTY);

    if (badClnPos) {
        return false;
    }

    let pathClean1 = isEmptyPath(x, y, glass);
    let pathClean2 = isEmptyPath(x-1, y, glass);
    let pathClean3 = isEmptyPath(x+1, y, glass);

    return pathClean1 && pathClean2 && pathClean3;
}

function isEmptyPath(x, y, glass) {
    let pathClean = true;
    for (let h1 = y; h1 < GLASS_HEIGHT; h1++) {
        if (glass[(h1) * GLASS_WIDTH + (x)] !== Element.EMPTY) {
            pathClean = false;
            break;
        }
    }
    return pathClean;
}

function findNearOffsetInGlass(glass, handler) {
    for (let y = 0; y < GLASS_HEIGHT; y++) {
        for (let x = 0; x < GLASS_WIDTH; x++) {
            if (handler(x, y, glass)) {
                return {x, y};
            }
        }
    }
    return null;
}

module.exports = answer;