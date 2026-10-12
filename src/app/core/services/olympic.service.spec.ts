import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { OlympicService } from './olympic.service';

describe('OlympicService', () => {
  let service: OlympicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlympicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return olympics from mock', async () => {
    const olympics = await firstValueFrom(service.getOlympics());
    expect(olympics.length).toBeGreaterThan(0);
    expect(olympics[0].country).toBeDefined();
  });

  it('should return a country by id', async () => {
    const italy = await firstValueFrom(service.getOlympicById(1));
    expect(italy?.country).toBe('Italy');
  });
});
