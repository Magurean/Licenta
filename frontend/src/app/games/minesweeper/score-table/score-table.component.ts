import { Component, Input, OnInit } from '@angular/core';
import { GameLevelEnum } from '../helpers/helpers';
import { User } from 'src/app/userModel';
import { UserService } from 'src/app/user.service';

@Component({
    selector: 'app-score-table',
    templateUrl: './score-table.component.html',
    styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit {
    @Input() gameLevel: GameLevelEnum;
    user: User;
    isLogged: boolean;

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.user = this.userService.User;
        this.isLogged = this.userService.userLogged;
    }
}
