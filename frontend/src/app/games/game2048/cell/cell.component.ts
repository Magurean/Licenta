import { Component, Input } from '@angular/core';
import { Cell } from '../helpers/helpers';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {

  @Input() cell: Cell;

  constructor() { }

  get class(): string {
    const cell = `color-${this.cell.value}`;
    if (this.cell.value === null) return 'empty';
    if (this.cell.wasMerged) return `${cell} merged`;
    return cell;
  }
}
