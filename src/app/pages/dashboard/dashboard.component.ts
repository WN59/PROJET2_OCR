import {HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Olympic } from '../../models/olympic.interface';
import { Stat } from '../../models/stat.interface';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly router = inject(Router);
  private readonly olympicService = inject(OlympicService);
  private olympics: Olympic[] = [];

  readonly titlePage = 'Medals per Country';
  readonly error = signal('');
  readonly stats = signal<Stat[]>([]);
  readonly chartLabels = signal<string[]>([]);
  readonly chartData = signal<number[]>([]);

  constructor() {
    this.olympicService.getOlympics()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (olympics: Olympic[]) => {
          this.olympics = olympics;
          const chartLabels = olympics.map((olympic) => olympic.country);
          const chartData = olympics.map((olympic) =>
            olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
          );
          const josCount = new Set(
            olympics.flatMap((olympic) =>
              olympic.participations.map((participation) => participation.year)
            )
          ).size;

          this.chartLabels.set(chartLabels);
          this.chartData.set(chartData);
          this.stats.set([
            { label: 'Number of countries', value: chartLabels.length },
            { label: 'Number of JOs', value: josCount },
          ]);
        },
        error: (error: HttpErrorResponse) => this.error.set(error.message),
      });
  }

  onCountryClick(countryName: string | number): void {
    const olympic = this.olympics.find((item) => item.country === countryName);
    if (!olympic) {
      this.router.navigateByUrl('/not-found');
      return;
    }
    this.router.navigate(['country', olympic.id]);
  }
}
