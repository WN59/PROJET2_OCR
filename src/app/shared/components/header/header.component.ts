import { Component, input } from '@angular/core';
import { Stat } from '../../../models/stat.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly title = input.required<string>();
  readonly stats = input<Stat[]>([]);
}
