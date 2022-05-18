import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { BrowserModule } from "@angular/platform-browser";
import { WordleComponent } from "./wordle.component";

@NgModule({
    declarations: [WordleComponent],
    imports: [CommonModule,
        MatDialogModule,
        MatIconModule,
        BrowserModule],
    exports: [WordleComponent]
})
export class WordleModule { }