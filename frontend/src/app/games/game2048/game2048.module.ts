import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CellComponent } from './cell/cell.component';
import { Game2048Component } from './game2048.component';
import { HelpersService } from './helpers/helpers.service';

@NgModule({
  declarations: [Game2048Component, CellComponent],
  imports: [CommonModule,
    MatDialogModule],
  providers: [HelpersService],
  exports: [Game2048Component]
})
export class Game2048Module { }
