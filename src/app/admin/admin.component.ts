import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, AfterViewInit {
  @ViewChild('userChart') userChart!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  userCount: number = 0;
  private animationFrameId: number = 0;
  private targetHeight: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserCount().subscribe((response) => {
      this.userCount = response.userCount;
      this.updateChart();
    });
  }

  ngAfterViewInit() {
    this.ctx = this.userChart.nativeElement.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.textAlign = "center";
    this.ctx.font = "bold 18px Arial";
  }

  updateChart() {
    this.targetHeight = this.userChart.nativeElement.height * (this.userCount / 100);
    this.animateBar();
  }

  animateBar() {
    let currentHeight = 0;
    const animate = () => {
      if (currentHeight < this.targetHeight) {
        currentHeight += 2; // Incremento para la animación
        this.drawBarChart(currentHeight);
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.drawBarChart(this.targetHeight); // Asegurarse que se dibuja completamente al final
        cancelAnimationFrame(this.animationFrameId);
      }
    };
    animate();
  }

  drawBarChart(height: number) {
    const canvasWidth = this.userChart.nativeElement.width;
    const canvasHeight = this.userChart.nativeElement.height;
    const barWidth = 150;
    const barX = (canvasWidth - barWidth) / 2;
    const barY = canvasHeight - height;

    // Fondo del gráfico
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.fillStyle = '#1e1e1e';
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Dibujar la barra con gradiente
    const gradient = this.ctx.createLinearGradient(barX, barY, barX + barWidth, barY + height);
    gradient.addColorStop(0, '#6a5acd');
    gradient.addColorStop(1, '#00bfff');
    this.ctx.fillStyle = gradient;
    this.ctx.shadowColor = '#000';
    this.ctx.shadowBlur = 10;
    this.ctx.fillRect(barX, barY, barWidth, height);

    // Quitar sombra para el texto
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(`Usuarios: ${this.userCount}`, canvasWidth / 2, barY - 10);
  }
}
