import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ERROR_MESSAGES } from '../../core/constants/error-messages';
import { OlympicService } from '../../core/services/olympic.service';
import { Stat } from '../../models/stat.interface';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-country-detail',
  imports: [HeaderComponent, ChartComponent, RouterLink, SpinnerComponent],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CountryDetailComponent {
  private readonly router = inject(Router);
  private readonly olympicService = inject(OlympicService);
  private readonly countryIdParam = inject(ActivatedRoute).snapshot.paramMap.get('id');

  readonly emptyMessage = ERROR_MESSAGES.empty;
  readonly loading = signal(true);
  readonly empty = signal(false);
  readonly error = signal('');
  readonly titlePage = signal('');
  readonly stats = signal<Stat[]>([]);
  readonly chartLabels = signal<number[]>([]);
  readonly chartData = signal<number[]>([]);

  constructor() {
    const countryId = Number(this.countryIdParam);

    if (!Number.isInteger(countryId) || countryId <= 0) {
      this.loading.set(false);
      this.goToNotFound(ERROR_MESSAGES.countryNotFound);
      return;
    }

    this.olympicService
      .getOlympicById(countryId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (olympic) => {
          this.loading.set(false);

          if (!olympic) {
            this.goToNotFound(ERROR_MESSAGES.countryNotFound);
            return;
          }

          const { country, participations } = olympic;
          this.titlePage.set(country);

          if (!participations?.length) {
            this.empty.set(true);
            return;
          }

          const chartLabels = participations.map((participation) => participation.year);
          const chartData = participations.map((participation) => participation.medalsCount);
          const totalMedals = chartData.reduce((total, medals) => total + medals, 0);
          const totalAthletes = participations.reduce(
            (total, participation) => total + participation.athleteCount,
            0
          );

          this.chartLabels.set(chartLabels);
          this.chartData.set(chartData);
          this.stats.set([
            { label: 'Number of entries', value: participations.length },
            { label: 'Total number of medals', value: totalMedals },
            { label: 'Total number of athletes', value: totalAthletes },
          ]);
        },
        error: (_error: HttpErrorResponse) => {
          this.loading.set(false);
          this.error.set(ERROR_MESSAGES.loadFailed);
        },
      });
  }

  private goToNotFound(message: string): void {
     this.router.navigateByUrl('/not-found', { state: { message } });
  }
}
