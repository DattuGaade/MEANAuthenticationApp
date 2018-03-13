import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(
    private flashMessagesService: FlashMessagesService,
    private authService : AuthService,
    private router: Router,
    private validateService: ValidateService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };
    if(!this.validateService.validateLogin(user)) {
      this.flashMessagesService.show('Please fill both username and password fields.',
        { cssClass: 'alert-danger', timeout: 3000 }
      );
      return false;
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.flashMessagesService.show('You are now logged in.',{ cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/dashboard']);
      } else {
        this.flashMessagesService.show(data.msg,{ cssClass: 'alert-danger', timeout: 4500 });
        this.router.navigate(['/login']);
      }
    });
  }

}
