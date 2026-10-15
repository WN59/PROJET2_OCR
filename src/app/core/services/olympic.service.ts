import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { Olympic } from '../../models/olympic.interface';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private readonly http = inject(HttpClient);
  private readonly olympicsUrl = 'assets/mock/olympic.json';

  /* Source unique + cache : 1 chargement partagé entre toutes les pages. */
  private readonly olympics$: Observable<Olympic[]> = (
    // throwError(() => new Error('error')) as Observable<Olympic[]>
    this.http.get<Olympic[]>(this.olympicsUrl)
  ).pipe(
      catchError(() => throwError(() => new Error(ERROR_MESSAGES.loadFailed))),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  /** Liste complète des pays olympiques. */
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$;
  }

  /** Un pays par ID (dérivé du même cache). */
  getOlympicById(id: number): Observable<Olympic | undefined> {
    return this.olympics$.pipe(
      map((olympics) => olympics.find((olympic) => olympic.id === id))
    );
  }
}
