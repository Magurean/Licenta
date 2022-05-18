export const CellCoordonates = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
];

export enum CellEnum {
    Mine = 'M',
    Flag = 'F'
}

export enum GameStatusEnum {
    Won = 'won',
    Lost = 'lost',
    Running = 'running',
    NotStarted = 'notStarted',
}

export enum GameLevelEnum {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
}

export interface ICell {
    type: string | number;
    y: number;
    x: number;
    i: number;
    label: CellEnum | string;
    isOpened: boolean;
    isMine: boolean;
    isMineExploded: boolean;
    isCenterZero?: boolean;
    openedIdClassName?: string;
    isWrongFlag?: boolean;
}

export interface IBoardData {
    board: number[][] | any[][];
    isBoardReseted: boolean;
}