import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ERROR_MESSAGES } from '../../core/constants/error-messages';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-not-found',
  imports: [HeaderComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})

export class NotFoundComponent {
  readonly titlePage = 'The page you are looking for does not exist';
  readonly errorMessage = this.getErrorMessage();

  private getErrorMessage(): string {
    const message = history.state?.['message'];
    return typeof message === 'string' ? message : ERROR_MESSAGES.urlNotFound;
  }
}
