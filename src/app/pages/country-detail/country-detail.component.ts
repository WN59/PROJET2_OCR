import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Olympic } from '../../models/olympic.interface';
import { Stat } from '../../models/stat.interface';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country-detail',
  imports: [HeaderComponent, ChartComponent, RouterLink],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailComponent {
  private readonly router = inject(Router);
  private readonly olympicService = inject(OlympicService);
  private readonly countryName = inject(ActivatedRoute).snapshot.paramMap.get('countryName');

  readonly error = signal('');
  readonly titlePage = signal('');
  readonly stats = signal<Stat[]>([]);
  readonly chartLabels = signal<number[]>([]);
  readonly chartData = signal<number[]>([]);

  constructor() {
    if (!this.countryName) {
      this.router.navigateByUrl('/not-found');
      return;
    }
    this.olympicService.getOlympicByCountry(this.countryName)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (olympic: Olympic | undefined) => {
          if (!olympic) {
            this.router.navigateByUrl('/not-found');
            return;
          }
          const { country, participations } = olympic;
          const chartLabels = participations.map((participation) => participation.year);
          const chartData = participations.map((participation) => participation.medalsCount);
          const totalMedals = chartData.reduce((total, medals) => total + medals, 0);
          const totalAthletes = participations.reduce(
            (total, participation) => total + participation.athleteCount,
            0
          );

          this.titlePage.set(country);
          this.chartLabels.set(chartLabels);
          this.chartData.set(chartData);
          this.stats.set([
            { label: 'Number of entries', value: participations.length },
            { label: 'Total number of medals', value: totalMedals },
            { label: 'Total number of athletes', value: totalAthletes },
          ]);
        },
        error: (error: HttpErrorResponse) => this.error.set(error.message),
      });
  }


}
