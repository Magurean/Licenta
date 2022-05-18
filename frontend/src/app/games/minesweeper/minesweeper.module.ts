import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Hammer from 'hammerjs';
import { MinesweeperComponent } from './minesweeper.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ScoreTableComponent } from './score-table/score-table.component';
import { CellComponent } from './cell/cell.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HelpersModule } from './helpers/helpers.module';
import { SnackBarService } from 'src/app/shared/snackbar.service';

@Injectable()
export class MinesweeperHammerConfig extends HammerGestureConfig {
    buildHammer(element: HTMLElement) {
        const ta = new Hammer(element, {
            touchAction: "auto",
        });
        return ta;
    }
}

@NgModule({
    declarations: [
        MinesweeperComponent,
        ScoreTableComponent,
        CellComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HelpersModule,
        HammerModule,
        MatIconModule,
        MatDialogModule
    ],
    exports: [MinesweeperComponent],
    providers: [{
        provide: HAMMER_GESTURE_CONFIG,
        useClass: MinesweeperHammerConfig
    }]
})
export class MinesweeperModule { }