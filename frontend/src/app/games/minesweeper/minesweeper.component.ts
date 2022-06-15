import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { delay, distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/userModel';
import { CellCoordonates, CellEnum, GameLevelEnum, GameStatusEnum, IBoardData, ICell } from './helpers/helpers';
import { MinesweeperService } from './helpers/helpers.service';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MinesweeperComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('boardInner') boardInner: ElementRef;
  @ViewChild('resetButton') resetButton: ElementRef;
  @ViewChild('boardFace') boardFace: ElementRef;

  boardParsed: ICell[][] = [];
  gameLevel: GameLevelEnum;
  gameStatus: string | undefined;
  flagsAvailable: Observable<number>;
  timer: number = 0;
  horizontal: number;
  vertical: number;
  minesLength: number;
  gameLevelObservable = new BehaviorSubject<GameLevelEnum>(GameLevelEnum.Easy);
  timerSub: Subscription;
  unsubscribeAll: Subject<any>;
  isFirstLoad: boolean = true;
  user: User;

  constructor(
    private minesweeper: MinesweeperService,
    private elementRef: ElementRef,
    private userService: UserService
  ) {
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.user = this.userService.User;
    this.minesweeper.boardData.subscribe((boardData: IBoardData) => {
      this.parseBoard(boardData.board);
      if (!boardData.isBoardReseted) {
        this.minesweeper.firstCellIsReadyToOpen.next(true);
      }
    });

    this.gameLevelObservable
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(gameLevelSelected => {
        if (gameLevelSelected === GameLevelEnum.Easy) {
          this.vertical = 9;
          this.horizontal = 9;
          this.minesLength = 15;
        } else if (gameLevelSelected === GameLevelEnum.Medium) {
          this.vertical = 14;
          this.horizontal = 14;
          this.minesLength = 40;
        } else if (gameLevelSelected === GameLevelEnum.Hard) {
          this.vertical = 16;
          this.horizontal = 20;
          this.minesLength = 70;
        }

        this.gameLevel = gameLevelSelected;
        this.createNewEmptyBoard();
        this.flagsAvailable = this.minesweeper.flagsAvailable;
      });

    this.minesweeper.gameStatus
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((status: GameStatusEnum | undefined) => {
        if (status === GameStatusEnum.Running) {
          this.startTimer();
        } else if (status === GameStatusEnum.Lost || status === GameStatusEnum.Won) {
          this.unsubscribeTimer();

          if (status === GameStatusEnum.Won) {
            this.manageBestScores(this.gameLevel, this.timer);
            this.minesweeper.flagsAvailable.next(0);
          }
        }

        this.gameStatus = status;
      });

    this.minesweeper.remainingEmptyCells
      .pipe(
        takeUntil(this.unsubscribeAll),
        distinctUntilChanged(),
        filter(length => length === 0)
      )
      .subscribe(() => this.minesweeper.setGameStatus(GameStatusEnum.Won));
  }

  manageBestScores(gameLevel: string, lastTime: number): void {
    if (this.userService.userLogged) {
      if (gameLevel == 'easy'
        && (lastTime < this.user.minesweeperScoreEasy
          || this.user.minesweeperScoreEasy == 0)) {
        this.user.minesweeperScoreEasy = lastTime
        this.userService.updateUser(this.user).subscribe(response => { });
        this.userService.User = this.user;
      }
      else if (gameLevel == 'medium'
        && (lastTime < this.user.minesweeperScoreMedium
          || this.user.minesweeperScoreMedium == 0)) {
        this.user.minesweeperScoreMedium = lastTime
        this.userService.updateUser(this.user).subscribe(response => { });
      }
      else if (gameLevel == 'hard'
        && (lastTime < this.user.minesweeperScoreHard
          || this.user.minesweeperScoreHard == 0)) {
        this.user.minesweeperScoreHard = lastTime
        this.userService.updateUser(this.user).subscribe(response => { });
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isFirstLoad = false;
    }, 0);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  createNewEmptyBoard(): void {
    this.minesweeper.createBoard(this.vertical, this.horizontal, this.minesLength);
    this.minesweeper.isFirstCellClicked.next(true);
    this.unsubscribeTimer();
    this.timer = 0;
  }

  onOpenCell(clickedCellCoord: number[]): void {
    if (this.minesweeper.isFirstCellClicked.value) {
      this.minesweeper.firstCellIsReadyToOpen
        .pipe(take(1), delay(50))
        .subscribe(() => this.openCell(clickedCellCoord));
      this.minesweeper.isFirstCellClicked.next(false);
      this.minesweeper.addMines(clickedCellCoord);
    }
    else if (this.isCellOpened(clickedCellCoord)) {
      this.manageCellsAround(clickedCellCoord);
    }
    else {
      this.openCell(clickedCellCoord);
    }
  }

  onChangeGameLevel(levelSelected: GameLevelEnum): void {
    this.gameLevelObservable.next(levelSelected);
  }

  onChangeFlagsAvailable(flagsAvailable: number): void {
    this.minesweeper.flagsAvailable.next(flagsAvailable);
  }

  onFocusCell(event): void {
    const nextCell = this.elementRef.nativeElement.querySelector(`[data-i="${event}"]`);
    nextCell.focus();
  }

  onFocusResetButton(): void {
    setTimeout(() => this.resetButton.nativeElement.focus(), 200);
  }

  trackByRow(index: number, element: ICell[]): number {
    return index;
  }

  trackByCell(index: number, element: ICell): number {
    return element.i;
  }

  parseBoard(board: number[][]): void {
    this.boardParsed = [];
    for (let y = 0; y < board.length; y++) {
      const row: ICell[] = [];

      for (let x = 0; x < board[y].length; x++) {
        row.push({
          type: board[y][x],
          y: y,
          x: x,
          i: (y * this.horizontal) + x,
          label: '',
          isOpened: false,
          isMine: false,
          isMineExploded: false,
        });
      }

      this.boardParsed.push(row);
    }
  }

  startTimer(): void {
    if (!this.timerSub) {
      this.timerSub = timer(0, 1000).subscribe((second: number) => this.timer = second);
    }
  }

  unsubscribeTimer(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = null;
    }
  }

  openCell(clickedCellCoord: number[]): void {
    const cellData = this.getCellDataByCoord(clickedCellCoord);

    if (cellData.type === CellEnum.Mine) {
      cellData.isMineExploded = true;
      this.minesweeper.setGameStatus(GameStatusEnum.Lost);

      return;
    }

    this.minesweeper.setGameStatus(GameStatusEnum.Running);

    cellData.isOpened = true;

    if (cellData.type === 0) {
      this.openCellsAroundZero(cellData);
      this.updateRemainingEmptyCells();
    } else {
      cellData.label = cellData.type.toString();
      cellData.openedIdClassName = `opened-${cellData.type}`;
      this.minesweeper.decreaseRemainingEmptyCells(1);
    }
  }

  updateRemainingEmptyCells(): void {
    const minesweeper = this.minesweeper;
    const allOpenedCells = this.findAllCellDataByKeyValue("isOpened", true);
    const remainEmptyCells = minesweeper.vertical * minesweeper.horizontal - (minesweeper.minesLenght + allOpenedCells.length);

    minesweeper.remainingEmptyCells.next(remainEmptyCells);
  }

  openCellsAroundZero(clickedCellData: ICell): void {
    clickedCellData.isCenterZero = true;

    while (clickedCellData) {
      clickedCellData.openedIdClassName = "";

      for (let i = 0; i < CellCoordonates.length; i++) {
        const cellAroundCoords = this.getCellAroundCoordByCenterCellCoord(i, [clickedCellData.y, clickedCellData.x]);

        if (this.isThereCellAround(cellAroundCoords)) {
          const cellAroundData = this.getCellDataByCoord(cellAroundCoords);

          if (cellAroundData.label !== CellEnum.Flag) {
            if (cellAroundData.type === 0) {
              if (!cellAroundData.isCenterZero) {
                cellAroundData.isOpened = true;
                cellAroundData.openedIdClassName = "opened-0";
              }
            } else if (!cellAroundData.isOpened) {
              cellAroundData.label = cellAroundData.type.toString();
              cellAroundData.isOpened = true;
              cellAroundData.openedIdClassName = `opened-${cellAroundData.type}`;
            }
          }
        }
      }

      clickedCellData = this.findCellDataByKeyValue("openedIdClassName", "opened-0");

      if (clickedCellData) {
        clickedCellData.isCenterZero = true;
      }
    }
  }

  isCellOpened(cellCoord): boolean {
    return this.getCellDataByCoord(cellCoord).isOpened;
  }

  manageCellsAround(clickedCellCoord: number[]): void {
    const cellData = this.getCellDataByCoord(clickedCellCoord);
    const cellType = (cellData.type as number);

    if (!isNaN(cellType) && cellType != 0) {
      let flagsAroundLength = this.getFlagsAroundLength(clickedCellCoord);

      if (cellType === flagsAroundLength) {
        this.openCellsAround(clickedCellCoord);
      }
    }
  }

  getFlagsAroundLength(clickedCellCoord: number[]): number {
    let flagsAroundLength = 0;

    for (let i = 0; i < CellCoordonates.length; i++) {
      const cellAroundCoords = this.getCellAroundCoordByCenterCellCoord(i, clickedCellCoord);

      if (this.isThereCellAround(cellAroundCoords)) {
        const cellAroundData = this.getCellDataByCoord(cellAroundCoords);

        if (cellAroundData.label === CellEnum.Flag) {
          flagsAroundLength++;
        }
      }
    }

    return flagsAroundLength;
  }

  getCellAroundCoordByCenterCellCoord(index: number, centerCellCoord: number[]): number[] {
    const aroundGetter = CellCoordonates[index];
    const cellAroundY = centerCellCoord[0] + aroundGetter[0];
    const cellAroundX = centerCellCoord[1] + aroundGetter[1];

    return [cellAroundY, cellAroundX];
  }

  openCellsAround(clickedCellCoord: number[]): void {
    let willLost = false;

    for (let i = 0; i < CellCoordonates.length; i++) {
      const cellAroundCoords = this.getCellAroundCoordByCenterCellCoord(i, clickedCellCoord);

      if (this.isThereCellAround(cellAroundCoords)) {
        const cellAroundData = this.getCellDataByCoord(cellAroundCoords);

        if (cellAroundData.label === CellEnum.Flag || cellAroundData.isOpened) {
          continue;
        }

        if (cellAroundData.type === CellEnum.Mine && !willLost) {
          willLost = true;

          continue;
        }

        this.openCell(cellAroundCoords);
      }
    }

    if (willLost) {
      this.minesweeper.setGameStatus(GameStatusEnum.Lost);
    }
  }

  isThereCellAround(cellAroundCoords: number[]): boolean {
    return cellAroundCoords[0] >= 0 && cellAroundCoords[0] < this.minesweeper.vertical &&
      cellAroundCoords[1] >= 0 && cellAroundCoords[1] < this.minesweeper.horizontal;
  }

  findCellDataByKeyValue(key: string, value: any): ICell {
    for (let y = 0; y < this.boardParsed.length; y++) {
      const row = this.boardParsed[y];
      const result = row.find(cell => cell[key] === value);

      if (result) {
        return result;
      }
    }

    return undefined;
  }

  findAllCellDataByKeyValue(key: string, value: any): ICell[] {
    let result = [];
    for (let i = 0; i < this.boardParsed.length; i++) {
      const row = this.boardParsed[i];
      const filteredRow = row.filter(cell => cell[key] === value);

      if (filteredRow.length) {
        for (let j = 0; j < filteredRow.length; j++) {
          result.push(filteredRow[j]);
        }
      }
    }
    return result;
  }

  getCellDataByCoord(cellCoord: number[]): ICell {
    return this.boardParsed[cellCoord[0]][cellCoord[1]];
  }
}