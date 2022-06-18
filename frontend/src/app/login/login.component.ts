import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { catchError, tap } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { SnackBarService } from '../shared/snackbar.service';
import { UserService } from '../user.service';
import { User, UserLogin } from '../userModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    private dialogRef: MatDialogRef<AppComponent>,
    private userService: UserService,
    private snackBarService: SnackBarService) { }
  isLogin: boolean = true;
  user: User;
  form = new UntypedFormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        type: 'email',
        label: 'Email address',
        placeholder: 'Enter email',
        required: this.isLogin,
      },
      hideExpression: () => this.isLogin
    },
    {
      key: 'username',
      type: 'input',
      templateOptions: {
        label: 'Username',
        placeholder: 'Enter username',
        required: true,
      }
    },
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        type: 'password',
        label: 'Password',
        placeholder: 'Enter password',
        required: true,
      }
    }
  ];

  onSignUp() {
    this.isLogin = !this.isLogin;
  }

  submit(model: UserLogin) {
    const newUser: UserLogin = {
      username: model.username,
      password: model.password,
      email: model?.email
    }

    if (this.form.valid) {
      this.userService.loginUser(newUser).pipe(tap(event => {
        this.snackBarService.openSnackBar("You are successfully logged in!", "Close");
        this.userService.userLogged = true;
        this.dialogRef.close();
      }),
        catchError(errorRes => {
          if (errorRes.error == "not ok")
            this.snackBarService.openSnackBar("Username already exists!", "Close");
          if (errorRes.error == "user not found")
            this.snackBarService.openSnackBar("Wrong username or password!", "Close");
          return "bad";
        })
      ).map((user: User) => {
        return user;
      }
      ).subscribe(x => {
        this.userService.User = x;
      });

      this.form.reset();
    }
  }

}