import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnDestroy {
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private chartInstance: Chart | null = null;

  readonly type = input.required<ChartType>();
  readonly labels = input.required<(string | number)[]>();
  readonly data = input.required<number[]>();
  readonly datasetLabel = input('Medals');
  readonly colors = input<string | string[]>([
    '#0b868f',
    '#adc3de',
    '#7a3c53',
    '#8f6263',
    'orange',
    '#94819d',
  ]);
  readonly aspectRatio = input(2.5);
  readonly caption = input<string>();
  readonly chartClick = output<string | number>();

  constructor() {
    effect(() => {
      const canvas = this.canvas()?.nativeElement;
      const labels = this.labels();
      const data = this.data();

      // Dépendances lues pour recalculer le graphique si elles changent
      this.type();
      this.datasetLabel();
      this.colors();
      this.aspectRatio();

      if (!canvas || !labels.length || !data.length) {
        return;
      }

      this.createChart(canvas);
    });
  }

  ngOnDestroy(): void {
    this.chartInstance?.destroy();
    this.chartInstance = null;
  }

  private createChart(canvas: HTMLCanvasElement): void {
    this.chartInstance?.destroy();

    const type = this.type();
    this.chartInstance = new Chart(canvas, {
      type,
      data: {
        labels: this.labels(),
        datasets: [
          {
            label: this.datasetLabel(),
            data: this.data(),
            backgroundColor: this.colors(),
            hoverOffset: type === 'pie' ? 4 : undefined,
          },
        ],
      },
      options: {
        aspectRatio: this.aspectRatio(),
        onClick: (_event, elements) => {
          if (!elements.length) {
            return;
          }
          const label = this.chartInstance?.data.labels?.[elements[0].index];
          if (label !== undefined && label !== null) {
            this.chartClick.emit(label as string | number);
          }
        },
      },
    });
  }
}
