import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Olympic } from '../../models/olympic.interface';
import { Participation } from '../../models/participation.interface';
import { Stat } from '../../models/stat.interface';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  error!: string;
  titlePage!: string;
  olympics!: Olympic[];
  stats!: Stat[];
  chartLabels: number[] = [];
  chartData: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const countryName = this.route.snapshot.paramMap.get('countryName');

    this.http.get<Olympic[]>(this.olympicUrl).subscribe({
      next: (data: Olympic[]) => {
        this.olympics = data;
        const selectedCountry = this.olympics.find(
          (olympic: Olympic) => olympic.country === countryName
        );

        if (!selectedCountry) {
          this.router.navigateByUrl('/not-found');
          return;
        }

        this.titlePage = selectedCountry.country;
        const participations = selectedCountry.participations;
        this.chartLabels = participations.map((participation: Participation) => participation.year);
        this.chartData = participations.map(
          (participation: Participation) => participation.medalsCount
        );
        const totalMedals = this.chartData.reduce((acc, medalsCount) => acc + medalsCount, 0);
        const totalAthletes = participations.reduce(
          (acc, participation: Participation) => acc + participation.athleteCount,
          0
        );

        this.stats = [
          { label: 'Number of entries', value: participations.length },
          { label: 'Total number of medals', value: totalMedals },
          { label: 'Total number of athletes', value: totalAthletes },
        ];
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
      },
    });
  }
}
