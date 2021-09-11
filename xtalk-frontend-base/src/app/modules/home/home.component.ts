import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@/_servies/authentication.service';
import { UserService } from '@/_servies/user.service';
import { Router } from '@angular/router';
import { User } from '@/_models';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // currentUser:User;
  users = [];
  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,) {

  }

  ngOnInit() {
    this.loadAllUsers();
    var bodyEle = document.getElementsByTagName('body')[0];
    //bodyEle.scrollIntoView();

  }

  deleteUser(id: string) {
    this.userService.delete(id)
      .pipe(first())
      .subscribe(() => this.loadAllUsers());
  }

  private loadAllUsers() {
    this.userService.getAllUser()
      .pipe(first())
      .subscribe(users => this.users = users.data);
  }
}
