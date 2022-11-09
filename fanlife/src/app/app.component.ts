import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { nameHolder, PlayernameService } from './name/playername.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fanlife';
  playerName: nameHolder;
  isLoggedIn: boolean;
  username: string;
  auth: AngularFireAuth;
  email: string;
  password: string;

  constructor(private nameService: PlayernameService,
              private fireauth: AngularFireAuth,
              private snackbar: MatSnackBar)
  {
    this.playerName = nameService.getName();
    this.isLoggedIn = false;
    this.username = "";
    this.auth = fireauth;
    this.email = "";
    this.password = "";
  }

  login() {
    this.auth.signInWithEmailAndPassword(this.email, this.password).catch(error => {
      const code = error.code;
      if (code === 'auth/user-not-found') {
        // create new user
        this.auth.createUserWithEmailAndPassword(this.email, this.password).catch(error => {
          const code = error.code;
          if (code == 'auth/weak-password') {
            this.snackbar.open('The password is too weak.', 'Dismiss', {duration: 3000});
            return;
          } else {
            this.snackbar.open('Error creating account: ' + error.message, 'Dismiss', {duration: 3000});
            return;
          }
        });
      } else if (code === 'auth/wrong-password') {
        this.snackbar.open('Incorrect password!', 'Dismiss', {duration: 3000});
        return;
      } else {
        this.snackbar.open('Error signing in: ' + error.message, 'Dismiss', {duration: 3000});
        return;
      }
      // successfully signed in?
      this.snackbar.open('Successfully signed in!', 'Dismiss', {duration: 3000});
    });
  }
  logout() {
    this.auth.signOut();
  }
  changeEmail(email: string) {
    this.email = email;
  }
  changePassword(pass: string) {
    this.password = pass;
  }
}
