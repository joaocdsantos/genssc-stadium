// src/constants/stadium.js

// Colors
export const COLORS = {
    RED: 0xff0000,
    WHITE: 0xffffff,
    GREEN: 0x006400,
    GOLD: 0xffd700,
    ECLIPSE: 0x404040,
    GREY_METAL: 0x555555,
    LIGHT_GREY: 0xCCCCCC,
};
// Bench stadium parameters
export const STADIUM = {
    ROWS: 6,
    GREEN_COLUMNS: 22,
    WHITE_COLUMNS: 21,
    RED_COLUMNS: 22,
    SPACING: 1,
    GAP_BETWEEN_GROUPS: 1.5,  // * SPACING 1???????
    STEP_HEIGHT: 0.5,
    Z_START: 0,
};
// lights parameters
export const LIGHT={
    AMBIENT: {
        INTENSITY: 3
    },
    DIRECTIONAL: {
        INTENSITY: 1,
        POSITION: [10, 10, 10]
    }
}

export const SEAT= {
    WIDTH: 0.5,
    HEIGHT: 0.15,
    DEPTH: 0.5,
}

export const PILLAR = {
    WIDTH: 0.3,
    HEIGHT: 0.15,
    DEPTH: 0.3,
}

export const ROW_LETTERS = ['F', 'E', 'D', 'C', 'B', 'A'];