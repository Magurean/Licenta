import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class SnackBarService {

    constructor(private snackBar: MatSnackBar) {
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: "snackbar"
        });
    }
}