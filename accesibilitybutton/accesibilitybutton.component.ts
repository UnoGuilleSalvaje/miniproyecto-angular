import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgStyle } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-accesibilitybutton',
  standalone: true,
  imports: [ FormsModule, MatIconModule, MatCardModule, NgStyle, RouterOutlet, CommonModule],
  templateUrl: './accesibilitybutton.component.html',
  styleUrl: './accesibilitybutton.component.css'
})
export class AccessibilityButtonComponent implements OnInit {
  showOptions: boolean = false;
  isHighContrast: boolean = false;
  isAlternativePalette: boolean = false;

  fontSize: number = 14;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  ngOnInit(): void {
    this.loadExternalScript('https://unpkg.com/ttsreader-plugin/main.js');
  }

  loadExternalScript(src: string): void {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.defer = true;
    this.renderer.appendChild(this.elRef.nativeElement.ownerDocument.body, script);
  }

  toggleAccessibilityOptions(): void {
    this.showOptions = !this.showOptions;
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
      this.renderer.addClass(body, 'high-contrast');
    } else {
      this.renderer.removeClass(body, 'high-contrast');
    }
  }
}