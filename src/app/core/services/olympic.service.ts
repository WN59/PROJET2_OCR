import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { olympicMock } from '../../data/olympic.mock';
import { Olympic } from '../../models/olympic.interface';

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  /** Récupère la liste complète des pays olympiques. */
  getOlympics(): Observable<Olympic[]> {
    return of(olympicMock).pipe(delay(1000));
    //return throwError(() => new Error('Not implemented'));
    //return of([]);
  }

  /** Récupère un pays par son ID. */
  getOlympicById(id: number): Observable<Olympic | undefined> {
    return of(olympicMock.find((olympic) => olympic.id === id)).pipe(delay(500));
    //return throwError(() => new Error('Not implemented'));
    //return of(undefined);
  }
}
