import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/userModel';
import { Cell, Directions } from './helpers/helpers';
import { HelpersService } from './helpers/helpers.service';

@Component({
  selector: 'app-game2048',
  templateUrl: './game2048.component.html',
  styleUrls: ['./game2048.component.scss']
})
export class Game2048Component implements OnInit, OnDestroy {
  user: User;
  isLogged: boolean;
  cells: Cell[];
  score: number;
  isGameOver: boolean = false;
  isCompleted: boolean = false;

  constructor(private game: HelpersService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.User;
    this.isLogged = this.userService.userLogged;
    this.initGame();
  }

  ngOnDestroy(): void {
    this.restart()
  }

  @HostListener('window:keyup', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    let canMove = false;
    const direction = Directions[event.keyCode];

    if (this.isGameOver || direction === undefined) return;

    this.game.move(direction).subscribe((mergeScore: number) => {
      canMove = canMove || this.score < mergeScore;
    }, console.error, () => {
      if (this.isGameOver
        && this.user
        && this.score > this.user.game2048Score) {
        this.user.game2048Score = this.score;
        this.userService.updateUser(this.user).subscribe(x => { });
        return;
      }
      if (this.isGameOver) return;
      if (canMove)
        this.game.addNewValue();
      this.score = this.game.score;
      this.isGameOver = this.game.isGameOver();
    });
  }

  initGame(): void {
    this.cells = this.game.cells;
    this.isGameOver = false;
    this.isCompleted = false;
    this.game.addNewValue();
    this.game.addNewValue();
    this.cells.map(cell => cell.success.subscribe(this.gameComplete));
  }

  restart(): void {
    this.score = 0;
    this.game.restart();
    this.initGame();
  }

  gameComplete(): void {
    this.isGameOver = true;
    this.isCompleted = true;
  }
}
