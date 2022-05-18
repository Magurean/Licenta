import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { actionHandler, Cell, Direction } from './helpers';

@Injectable()
export class HelpersService {
    rows: Cell[][] = [];
    columns: Cell[][] = [];
    cells: Cell[] = Array(16).fill(null).map(_ => new Cell());
    score: number = 0;

    constructor() {
        this.initializeGame();
    }

    random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    hasMoves(): boolean {
        const column1 = this.columns[0];
        const column2 = this.columns[1];
        const column3 = this.columns[2];
        const column4 = this.columns[3];
        const row1 = this.rows[0];
        const row2 = this.rows[1];
        const row3 = this.rows[2];
        const row4 = this.rows[3];
        let hasColumnMoves = false;
        let hasRowMoves = false;

        for (var i = 1; i < 4; i++) {
            if (this.equalValue(column1[i - 1], column1[i])
                || this.equalValue(column2[i - 1], column2[i])
                || this.equalValue(column3[i - 1], column3[i])
                || this.equalValue(column4[i - 1], column4[i])) {
                hasColumnMoves = true
                continue
            }
        }

        if (hasColumnMoves) return true;

        for (var i = 1; i < 4; i++) {
            if (this.equalValue(row1[i - 1], row1[i])
                || this.equalValue(row2[i - 1], row2[i])
                || this.equalValue(row3[i - 1], row3[i])
                || this.equalValue(row4[i - 1], row4[i])) {
                hasRowMoves = true
                continue
            }
        }

        return hasRowMoves;
    }

    getEmptyCells(): Cell[] {
        return this.cells.reduce((acc: Cell[], cell) => {
            if (cell.isEmpty) acc.push(cell);
            return acc;
        }, []);
    }

    equalValue(cell1: Cell, cell2: Cell): boolean {
        return cell1.value === cell2.value;
    }

    isGameOver(): boolean {
        return !this.hasMoves() && this.getEmptyCells().length === 0;
    }

    restart(): void {
        this.cells = Array(16).fill(null).map(_ => new Cell());
        this.score = 0;
        this.initializeGame();
    }

    initializeGame(): void {
        this.columns = [
            [this.cells[0], this.cells[4], this.cells[8], this.cells[12]],
            [this.cells[1], this.cells[5], this.cells[9], this.cells[13]],
            [this.cells[2], this.cells[6], this.cells[10], this.cells[14]],
            [this.cells[3], this.cells[7], this.cells[11], this.cells[15]],
        ];

        this.rows = [
            [this.cells[0], this.cells[1], this.cells[2], this.cells[3]],
            [this.cells[4], this.cells[5], this.cells[6], this.cells[7]],
            [this.cells[8], this.cells[9], this.cells[10], this.cells[11]],
            [this.cells[12], this.cells[13], this.cells[14], this.cells[15]],
        ];
    }

    move(direction: Direction): Observable<any> {
        return actionHandler[direction]
            (direction === Direction.Left || direction === Direction.Right ? this.columns : this.rows)
            .map((mergeScore: number) => {
                this.score += mergeScore; console.log(mergeScore);
                return this.score;
            });
    }

    addNewValue(): void {
        const emptyCell: Cell[] = this.getEmptyCells();
        if (emptyCell.length === 0) return;
        const randomPosition = this.random(0, emptyCell.length - 1);
        const randomValue = this.random(1, 2) === 1 ? 2 : 4;
        emptyCell[randomPosition].value = randomValue;
    }
}