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
  @ViewChild('revenueChart') revenueChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topEstanciasChart') topEstanciasChart!: ElementRef<HTMLCanvasElement>;
  private userCtx!: CanvasRenderingContext2D;
  private revenueCtx!: CanvasRenderingContext2D;
  private topEstanciasCtx!: CanvasRenderingContext2D;
  userCount: number = 0;
  totalRevenue: number = 0;
  topEstancias: { nombre: string; count: number }[] = [];
  private userAnimationFrameId: number = 0;
  private revenueAnimationFrameId: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserCount().subscribe((response) => {
      this.userCount = response.userCount;
      this.updateUserChart();
    });

    this.userService.getTotalRevenue().subscribe((response) => {
      this.totalRevenue = response.totalRevenue;
      this.updateRevenueChart();
    });

    this.userService.getTopEstancias().subscribe((response) => {
      this.topEstancias = response.topEstancias;
      this.updateTopEstanciasChart();
    });
  }

  ngAfterViewInit() {
    this.userCtx = this.userChart.nativeElement.getContext('2d')!;
    this.revenueCtx = this.revenueChart.nativeElement.getContext('2d')!;
    this.topEstanciasCtx = this.topEstanciasChart.nativeElement.getContext('2d')!;
  }

  updateUserChart() {
    const targetHeight = this.userChart.nativeElement.height * (this.userCount / 100);
    this.animateUserChart(targetHeight);
  }

  animateUserChart(targetHeight: number) {
    let currentHeight = 0;
    const animate = () => {
      if (currentHeight < targetHeight) {
        currentHeight += 2;
        this.drawUserChart(currentHeight);
        this.userAnimationFrameId = requestAnimationFrame(animate);
      } else {
        this.drawUserChart(targetHeight);
        cancelAnimationFrame(this.userAnimationFrameId);
      }
    };
    animate();
  }

  drawUserChart(height: number) {
    const canvasWidth = this.userChart.nativeElement.width;
    const canvasHeight = this.userChart.nativeElement.height;
    const barWidth = 100; // Ajustar el ancho de la barra
    const barX = (canvasWidth - barWidth) / 2;
    const barY = canvasHeight - height;

    this.userCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.userCtx.fillStyle = '#1e1e1e';
    this.userCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    const gradient = this.userCtx.createLinearGradient(barX, barY, barX + barWidth, barY + height);
    gradient.addColorStop(0, '#6a5acd');
    gradient.addColorStop(1, '#00bfff');
    this.userCtx.fillStyle = gradient;
    this.userCtx.shadowColor = '#000';
    this.userCtx.shadowBlur = 10;
    this.userCtx.fillRect(barX, barY, barWidth, height);

    this.userCtx.shadowBlur = 0;
    this.userCtx.fillStyle = '#fff';
    this.userCtx.fillText(`Usuarios: ${this.userCount}`, canvasWidth / 2, barY - 10);
  }

  updateRevenueChart() {
    const maxHeight = 0.60 * this.revenueChart.nativeElement.height;
    const targetHeight = Math.min(maxHeight, maxHeight * (this.totalRevenue / 1000));
    this.animateRevenueChart(targetHeight);
  }

  animateRevenueChart(targetHeight: number) {
    let currentHeight = 0;
    const animate = () => {
      if (currentHeight < targetHeight) {
        currentHeight += 2; // Ajustar el incremento de la animación
        this.drawRevenueChart(currentHeight);
        this.revenueAnimationFrameId = requestAnimationFrame(animate);
      } else {
        this.drawRevenueChart(targetHeight);
        cancelAnimationFrame(this.revenueAnimationFrameId);
      }
    };
    animate();
  }

  drawRevenueChart(height: number) {
    const canvasWidth = this.revenueChart.nativeElement.width;
    const canvasHeight = this.revenueChart.nativeElement.height;
    const barWidth = 80; // Ajustar el ancho de la barra
    const barX = (canvasWidth - barWidth) / 2;
    const barY = canvasHeight - height;

    this.revenueCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.revenueCtx.fillStyle = '#1e1e1e';
    this.revenueCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    const gradient = this.revenueCtx.createLinearGradient(barX, barY, barX + barWidth, barY + height);
    gradient.addColorStop(0, '#ff6347');
    gradient.addColorStop(1, '#ffa500');
    this.revenueCtx.fillStyle = gradient;
    this.revenueCtx.shadowColor = '#000';
    this.revenueCtx.shadowBlur = 10;
    this.revenueCtx.fillRect(barX, barY, barWidth, height);

    this.revenueCtx.shadowBlur = 0;
    this.revenueCtx.fillStyle = '#fff';
    this.revenueCtx.fillText(`Ganancias: $${this.totalRevenue}`, canvasWidth / 2, barY - 10);
  }

  updateTopEstanciasChart() {
    this.drawTopEstanciasChart();
  }

  drawTopEstanciasChart() {
    const canvasWidth = this.topEstanciasChart.nativeElement.width;
    const canvasHeight = this.topEstanciasChart.nativeElement.height;
    const barWidth = canvasWidth / 8;
    const maxCount = Math.max(...this.topEstancias.map(e => e.count));
    const scaleFactor = 0.6; // Ajusta este valor para controlar la altura máxima
  
    this.topEstanciasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.topEstanciasCtx.fillStyle = '#1e1e1e';
    this.topEstanciasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
  
    this.topEstancias.forEach((estancia, index) => {
      const barX = (index * (barWidth + 20)) + 40;
      const barHeight = Math.min((canvasHeight * scaleFactor / maxCount) * estancia.count, canvasHeight * scaleFactor);
      const barY = canvasHeight - barHeight;
  
      const gradient = this.topEstanciasCtx.createLinearGradient(barX, barY, barX + barWidth, barY + barHeight);
      gradient.addColorStop(0, '#4caf50');
      gradient.addColorStop(1, '#8bc34a');
      this.topEstanciasCtx.fillStyle = gradient;
      this.topEstanciasCtx.shadowColor = '#000';
      this.topEstanciasCtx.shadowBlur = 10;
      this.topEstanciasCtx.fillRect(barX, barY, barWidth, barHeight);

      this.topEstanciasCtx.shadowBlur = 0;
      this.topEstanciasCtx.fillStyle = '#fff';
      this.topEstanciasCtx.fillText(estancia.nombre, barX + barWidth / 2, barY - 10);
      this.topEstanciasCtx.fillText(`Count: ${estancia.count}`, barX + barWidth / 2, barY - 25);
    });
  }
}
