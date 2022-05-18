import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CellCoordonates, CellEnum, GameStatusEnum, IBoardData } from './helpers';

@Injectable()
export class MinesweeperService {
    board: number[][] | any[][];
    boardData = new Subject<IBoardData>();
    vertical: number;
    horizontal: number;
    minesLenght: number;
    minesPositions: number[][];
    isFirstBoard: boolean = true;
    remainingEmptyCells: BehaviorSubject<number>;
    remainingEmptyMines: BehaviorSubject<number>;
    flagsAvailable: BehaviorSubject<number>;
    gameStatus: BehaviorSubject<GameStatusEnum>;
    isFirstCellClicked = new BehaviorSubject(true);
    firstCellIsReadyToOpen = new Subject<boolean>();

    constructor() { }

    initBoard(): void {
        for (let y = 0; y < this.vertical; y++) {
            this.board.push([]);
            for (let x = 0; x < this.horizontal; x++) {
                this.board[y][x] = 0;
            }
        }
    }

    createBoard(vertical: number, horizontal: number, minesLenght: number): void {
        this.board = [];
        this.vertical = vertical;
        this.horizontal = horizontal;
        this.minesLenght = minesLenght;

        if (this.isFirstBoard) {
            this.remainingEmptyCells = new BehaviorSubject(this.vertical * this.horizontal - this.minesLenght);
            this.remainingEmptyMines = new BehaviorSubject(this.minesLenght);
            this.gameStatus = new BehaviorSubject(GameStatusEnum.NotStarted);
            this.flagsAvailable = new BehaviorSubject(this.minesLenght);
            this.isFirstBoard = false;
        } else {
            this.remainingEmptyCells.next(this.vertical * this.horizontal - this.minesLenght);
            this.remainingEmptyMines.next(this.minesLenght);
            this.gameStatus.next(GameStatusEnum.NotStarted);
            this.flagsAvailable.next(this.minesLenght);
        }

        this.initBoard();
        this.boardData.next({ board: [...this.board], isBoardReseted: true });
    }

    random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    addMines(firstCellOpened: number[]): void {
        this.addMinesCoords(this.minesLenght, firstCellOpened);
        this.insertMines();
        this.updateBoardNumbers();
        this.boardData.next({ board: [...this.board], isBoardReseted: false });
    }

    addMinesCoords(minesLenght: number, firstCellOpened: number[]): void {
        this.minesPositions = [];
        while (this.minesPositions.length < minesLenght) {
            let y = this.random(0, this.vertical);
            let x = this.random(0, this.horizontal);

            if (!this.isAlreadyAMine([y, x]) && this.isDifferentFromFirstCellOpened([y, x], firstCellOpened)) {
                this.minesPositions.push([y, x]);
            }
        }
    }

    decreaseRemainingEmptyCells(value: number): void {
        this.remainingEmptyCells.next(this.remainingEmptyCells.value - value);
    }

    setGameStatus(status: GameStatusEnum) {
        this.gameStatus.next(status);
    }

    insertMines(): void {
        for (let i = 0; i < this.minesPositions.length; i++) {
            let y = this.minesPositions[i][0];
            let x = this.minesPositions[i][1];
            this.board[y][x] = CellEnum.Mine;
        }
    }

    isAlreadyAMine(minePosition: number[]): boolean {
        return this.minesPositions.join(" ").includes(minePosition.toString());
    }

    isDifferentFromFirstCellOpened(randomCell: number[], firstCellOpened: number[]): boolean {
        return randomCell[0] !== firstCellOpened[0] || randomCell[1] !== firstCellOpened[1];
    }

    updateBoardNumbers(): void {
        for (let i = 0; i < this.minesPositions.length; i++) {
            for (let j = 0; j < CellCoordonates.length; j++) {
                let minePosition = this.minesPositions[i];
                let around = CellCoordonates[j];
                let boardY = minePosition[0] + around[0];
                let boardX = minePosition[1] + around[1];

                if (boardY >= 0 && boardY < this.vertical &&
                    boardX >= 0 && boardX < this.horizontal &&
                    typeof this.board[boardY][boardX] === 'number') {
                    this.board[boardY][boardX]++;
                }
            }
        }
    }
}
