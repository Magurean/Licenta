import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game2048Component } from './games/game2048/game2048.component';
import { MinesweeperComponent } from './games/minesweeper/minesweeper.component';
import { WordleComponent } from './games/wordle/wordle.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './user.service';
import { User } from './userModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public dialog: MatDialog,
    public userService: UserService) { }
  user: User = null;
  title = 'Licenta';

  openMinesweeper() {
    this.dialog.open(MinesweeperComponent);
  }

  open2048() {
    this.dialog.open(Game2048Component);
  }

  openWordle() {
    this.dialog.open(WordleComponent);
  }

  openLogin() {
    this.dialog.open(LoginComponent).afterClosed().subscribe(x => this.user = this.userService.User);
    if (this.userService.User) {
      this.userService.userLogged = true;
      this.user = this.userService.User
    }
  }

  logout() {
    this.userService.User = null;
    this.userService.userLogged = false;
    this.user = null;
  }
}
