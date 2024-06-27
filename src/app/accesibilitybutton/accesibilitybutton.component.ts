import { Component, OnInit, Renderer2, RendererStyleFlags2, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgStyle } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-accesibilitybutton',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatCardModule, NgStyle, RouterOutlet, CommonModule],
  templateUrl: './accesibilitybutton.component.html',
  styleUrls: ['./accesibilitybutton.component.css']
})
export class AccessibilityButtonComponent implements OnInit {
  showOptions: boolean = false;
  isHighContrast: boolean = false;
  isAlternativePalette: boolean = false;
  fontSize: number = 14;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  ngOnInit(): void {}

  loadExternalScript(src: string, id: string): void {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.id = id;
    script.defer = true;
    this.renderer.appendChild(this.elRef.nativeElement.ownerDocument.body, script);
  }

  unloadExternalScript(id: string): void {
    const script = this.elRef.nativeElement.ownerDocument.getElementById(id);
    if (script) {
      this.renderer.removeChild(this.elRef.nativeElement.ownerDocument.body, script);
    }
  }

  toggleAccessibilityOptions(): void {
    this.showOptions = !this.showOptions;
    const scriptId = 'ttsreader-plugin-script';
    if (this.showOptions) {
      this.loadExternalScript('https://unpkg.com/ttsreader-plugin/main.js', scriptId);
    } else {
      this.unloadExternalScript(scriptId);
    }
  }

  togglePalette(): void {
    this.isAlternativePalette = !this.isAlternativePalette;
  }

  applyProtanopia(): void {
    this.applyPalette('gold', 'purple', 'blue');
  }

  applyDeuteranopia(): void {
    this.applyPalette('blue', 'gold', 'yellow');
  }

  applyTritanopia(): void {
    this.applyPalette('pink', 'white', 'pink');
  }

  applyPalette(backgroundColor: string, textColor: string, highlightColor: string): void {
    const body = this.elRef.nativeElement.ownerDocument.body;
    body.style.backgroundColor = backgroundColor;
    body.style.color = textColor;

    const headings = body.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading: HTMLElement) => {
      heading.style.color = highlightColor;
    });

    const paragraphs = body.querySelectorAll('p');
    paragraphs.forEach((paragraph: HTMLElement) => {
      paragraph.style.color = textColor;
    });

    const buttons = body.querySelectorAll('button');
    buttons.forEach((button: HTMLElement) => {
      button.style.backgroundColor = highlightColor;
      button.style.color = textColor;
    });

    const links = body.querySelectorAll('a');
    links.forEach((link: HTMLElement) => {
      link.style.color = highlightColor;
    });

    this.isAlternativePalette = !this.isAlternativePalette;
  }

  increaseFontSize(): void {
    this.fontSize += 2;
    document.documentElement.style.fontSize = `${this.fontSize}px`;
  }

  decreaseFontSize(): void {
    if (this.fontSize > 10) {
      this.fontSize -= 2;
      document.documentElement.style.fontSize = `${this.fontSize}px`;
    }
  }

  toggleContrast(): void {
    const body = this.elRef.nativeElement.ownerDocument.body;
    this.isHighContrast = !this.isHighContrast;

    if (this.isHighContrast) {
        this.renderer.setStyle(body, 'background-color', '#43f7ff', RendererStyleFlags2.Important);
        this.renderer.setStyle(body, 'color', '#00ff88', RendererStyleFlags2.Important);

        const headings = body.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading: HTMLElement) => {
            this.renderer.setStyle(heading, 'color', '#00ff88', RendererStyleFlags2.Important);
        });

        const paragraphs = body.querySelectorAll('p');
        paragraphs.forEach((paragraph: HTMLElement) => {
            this.renderer.setStyle(paragraph, 'color', '#00ff88', RendererStyleFlags2.Important);
        });

        const buttons = body.querySelectorAll('button');
        buttons.forEach((button: HTMLElement) => {
            this.renderer.setStyle(button, 'background-color', '#ffff00', RendererStyleFlags2.Important);
            this.renderer.setStyle(button, 'color', '#00ff88', RendererStyleFlags2.Important);
        });

        const links = body.querySelectorAll('a');
        links.forEach((link: HTMLElement) => {
            this.renderer.setStyle(link, 'color', '#0000ff', RendererStyleFlags2.Important);
        });

    } else {
        // Restaurar los estilos originales (fondo oscuro, letras blancas)
        this.renderer.setStyle(body, 'background-color', '#00ff88', RendererStyleFlags2.Important);
        this.renderer.setStyle(body, 'color', '#43f7ff', RendererStyleFlags2.Important);

        const headings = body.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading: HTMLElement) => {
            this.renderer.setStyle(heading, 'color', '#43f7ff', RendererStyleFlags2.Important);
        });

        const paragraphs = body.querySelectorAll('p');
        paragraphs.forEach((paragraph: HTMLElement) => {
            this.renderer.setStyle(paragraph, 'color', '#43f7ff', RendererStyleFlags2.Important);
        });

        const buttons = body.querySelectorAll('button');
        buttons.forEach((button: HTMLElement) => {
            this.renderer.setStyle(button, 'background-color', '#333333', RendererStyleFlags2.Important);
            this.renderer.setStyle(button, 'color', '#43f7ff', RendererStyleFlags2.Important);
        });

        const links = body.querySelectorAll('a');
        links.forEach((link: HTMLElement) => {
            this.renderer.setStyle(link, 'color', '#00ffff', RendererStyleFlags2.Important);
        });
    }

    console.log('Modo de Alto Contraste:', this.isHighContrast);
}

}
