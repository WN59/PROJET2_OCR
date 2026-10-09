import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Olympic } from '../../models/olympic.interface';
import { Participation } from '../../models/participation.interface';
import { Stat } from '../../models/stat.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  readonly titlePage = 'Medals per Country';
  error!: string;
  olympics!: Olympic[];
  stats!: Stat[];
  chartLabels: string[] = [];
  chartData: number[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Olympic[]>(this.olympicUrl).subscribe({
      next: (data: Olympic[]) => {
        this.olympics = data;
        if (this.olympics && this.olympics.length > 0) {
          this.chartLabels = this.olympics.map((olympic: Olympic) => olympic.country);
          this.chartData = this.olympics.map((olympic: Olympic) =>
            olympic.participations.reduce(
              (acc: number, participation: Participation) => acc + participation.medalsCount,
              0
            )
          );
          const josCount = Array.from(
            new Set(
              this.olympics.flatMap((olympic: Olympic) =>
                olympic.participations.map((participation: Participation) => participation.year)
              )
            )
          ).length;

          this.stats = [
            { label: 'Number of countries', value: this.chartLabels.length },
            { label: 'Number of JOs', value: josCount },
          ];
        }
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
      },
    });
  }

  onCountryClick(countryName: string | number) {
    this.router.navigate(['country', countryName]);
  }
}
