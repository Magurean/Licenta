import { Component, Input, ViewEncapsulation, SimpleChanges, Output, EventEmitter, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MinesweeperService } from '../helpers/helpers.service';
import { ICell, CellEnum, GameStatusEnum } from '../helpers/helpers';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-cell',
    templateUrl: './cell.component.html',
    styleUrls: ['./cell.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CellComponent implements OnChanges {
    @Input() cell: ICell;
    @Input() horizontal: number;
    @Input() vertical: number;

    @Output() open = new EventEmitter<number[]>();
    @Output() changeFlagsAvailable = new EventEmitter<number>();
    @Output() focusCell = new EventEmitter<number>();
    @Output() focusResetButton = new EventEmitter<any>();

    gameStatus: Subscription;
    timeWhenPressed: Date;
    isAfterPressEvent = false;

    constructor(private minesweeper: MinesweeperService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.gameStatus) {
            this.gameStatus.unsubscribe();
        }
        if (changes
            && changes.cell
            && !changes.cell.isFirstChange()
            && this.cell.type === CellEnum.Mine) {
            this.gameStatusSubscription();
        }
    }

    gameStatusSubscription(): void {
        this.gameStatus = this.minesweeper.gameStatus
            .pipe(filter(status => status === GameStatusEnum.Lost
                || status === GameStatusEnum.Won))
            .subscribe((status: GameStatusEnum) => {
                if (status === GameStatusEnum.Lost) {
                    if (this.cell.label === CellEnum.Flag) {
                        if (this.cell.type !== CellEnum.Mine) {
                            this.cell.isWrongFlag = true;
                        }
                    } else {
                        this.cell.isOpened = true;
                        this.cell.isMine = true;
                        this.cell.label = this.cell.type.toString();
                    }
                } else {
                    this.cell.label = CellEnum.Flag;
                }
                this.gameStatus.unsubscribe();
            });
    }

    onClick(): void {
        const timeWhenClicked = new Date();

        if (!this.isFakeClick(timeWhenClicked) || !this.isUnableToOpen()) {
            this.open.emit([this.cell.y, this.cell.x]);
        }
    }

    isUnableToOpen(): boolean {
        return this.cell.label === CellEnum.Flag
            || this.minesweeper.gameStatus.value === GameStatusEnum.Won
            || this.minesweeper.gameStatus.value === GameStatusEnum.Lost
    }

    onPress(event): void {
        event.preventDefault();
        this.addFlag();
    }

    onPressUp(): void {
        this.timeWhenPressed = new Date();
        this.isAfterPressEvent = true;
    }

    onContextMenu(event): boolean {
        event.preventDefault();
        if (this.isAfterPressEvent || event.button === 0) {
            this.isAfterPressEvent = false;
            return false;
        }

        this.addFlag(event);
        return true;
    }

    addFlag(event?: Event): void {
        if (event)
            event.preventDefault();

        if (this.cannotFlag())
            return;

        if (this.cell.label === CellEnum.Flag) {
            this.cell.label = '';
            this.changeFlagsAvailable.emit(this.minesweeper.flagsAvailable.value + 1);
            if (this.cell.type !== CellEnum.Mine) {
                this.gameStatus.unsubscribe();
            }
        } else {
            this.cell.label = CellEnum.Flag;
            this.changeFlagsAvailable.emit(this.minesweeper.flagsAvailable.value - 1);
            if (this.cell.type !== CellEnum.Mine) {
                this.gameStatusSubscription();
            }
        }
    }

    cannotFlag(): boolean {
        return this.minesweeper.gameStatus.value === GameStatusEnum.Won
            || this.minesweeper.gameStatus.value === GameStatusEnum.Lost
            || this.minesweeper.isFirstCellClicked.value
            || this.cell.isOpened;
    }

    isFakeClick(timeWhenClicked: Date): boolean {
        return this.timeWhenPressed && timeWhenClicked.getTime() - this.timeWhenPressed.getTime() <= 250
    }
}
