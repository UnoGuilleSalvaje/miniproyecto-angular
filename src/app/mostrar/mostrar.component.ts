import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css']
})
export class MostrarComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      console.log(users);
      this.users = users as User[];

    });
  }
  
}
