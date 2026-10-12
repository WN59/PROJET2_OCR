import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { olympicMock } from '../../data/olympic.mock';
import { Olympic } from '../../models/olympic.interface';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  /** Récupère la liste complète des pays olympiques. */
  getOlympics(): Observable<Olympic[]> {
    return of(olympicMock);
  }

  /** Récupère un pays par son nom. */
  getOlympicByCountry(countryName: string): Observable<Olympic | undefined> {
    return of(olympicMock.find((olympic) => olympic.country === countryName));
  }

  /** Récupère un pays par son ID. */
  getOlympicById(id: number): Observable<Olympic | undefined> {
    return of(olympicMock.find((olympic) => olympic.id === id));
  }
}
