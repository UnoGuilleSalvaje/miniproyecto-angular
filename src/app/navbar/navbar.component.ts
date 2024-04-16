import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  ngOnInit() {
    this.loadScript('assets/js/navbar.js');
  }

  private loadScript(scriptUrl: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = scriptUrl;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
