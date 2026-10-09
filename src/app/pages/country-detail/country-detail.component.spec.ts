import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CountryDetailComponent } from './country-detail.component';

describe('CountryDetailComponent', () => {
  let component: CountryDetailComponent;
  let fixture: ComponentFixture<CountryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountryDetailComponent],
      imports: [HeaderComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'Italy' } } } },
        { provide: Router, useValue: { navigate: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
