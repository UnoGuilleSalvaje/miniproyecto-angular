import { Component } from '@angular/core';
import { Bloges } from '../interfaces/bloges';
import { RouterModule } from '@angular/router';
import { BlogesService } from '../services/blog.service';
import { blogos } from '../blogs';


@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  array:Bloges [] = [];

  miBlog : blogos [] = [];
  constructor(public blogService: BlogesService, public miservicio: BlogesService) {}

  ngOnInit() {
    console.log("En este instante el componente ha cargado");
    this.recuperarDatos();
    this.miBlog = this.miservicio.getbloges();
  }

  recuperarDatos(): void {
    console.log("Entré");

    this.blogService.retornar().subscribe({
      next: this.successRequest.bind(this),
      error: (err) => {console.log(err)}
    });
  }

  successRequest(data:any):void {
    console.log("data", data);
    this.array = data.blog;
    console.log("array", this.array);
  }
}

