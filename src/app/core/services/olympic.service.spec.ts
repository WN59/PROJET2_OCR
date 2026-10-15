import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Olympic } from '../../models/olympic.interface';
import { OlympicService } from './olympic.service';

describe('OlympicService', () => {
  let service: OlympicService;
  let httpTesting: HttpTestingController;

  const mockOlympics: Olympic[] = [
    {
      id: 1,
      country: 'Italy',
      participations: [
        {
          id: 1,
          year: 2012,
          city: 'Londres',
          medalsCount: 28,
          athleteCount: 372,
        },
      ],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr()), provideHttpClientTesting()],
    });
    service = TestBed.inject(OlympicService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return olympics from JSON', async () => {
    const olympicsPromise = firstValueFrom(service.getOlympics());

    const req = httpTesting.expectOne('assets/mock/olympic.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockOlympics);

    const olympics = await olympicsPromise;
    expect(olympics.length).toBeGreaterThan(0);
    expect(olympics[0].country).toBeDefined();
  });

  it('should return a country by id', async () => {
    const italyPromise = firstValueFrom(service.getOlympicById(1));

    const req = httpTesting.expectOne('assets/mock/olympic.json');
    req.flush(mockOlympics);

    const italy = await italyPromise;
    expect(italy?.country).toBe('Italy');
  });
});
