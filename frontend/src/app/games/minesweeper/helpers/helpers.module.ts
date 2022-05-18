import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerPipe } from './timer.pipe';
import { MinesweeperService } from './helpers.service';

@NgModule({
    declarations: [TimerPipe],
    providers: [MinesweeperService],
    imports: [CommonModule],
    exports: [CommonModule, TimerPipe]
})
export class HelpersModule { }
