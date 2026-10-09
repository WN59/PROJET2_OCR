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

  /** Type de graphique Chart.js (ex. pie, line). */
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
  /** Libellé optionnel sous le graphique (ex. "Date"). */
  readonly caption = input<string>();

  /** Émet le label cliqué (utile pour le pie du dashboard). */
  readonly chartClick = output<string | number>();

  constructor() {
    effect(() => {
      const canvasRef = this.canvas();
      const type = this.type();
      const labels = this.labels();
      const data = this.data();
      const datasetLabel = this.datasetLabel();
      const colors = this.colors();
      const aspectRatio = this.aspectRatio();

      if (!canvasRef || labels.length === 0 || data.length === 0) {
        return;
      }

      this.renderChart(canvasRef.nativeElement, type, labels, data, datasetLabel, colors, aspectRatio);
    });
  }

  ngOnDestroy() {
    this.chartInstance?.destroy();
    this.chartInstance = null;
  }

  private renderChart(
    canvas: HTMLCanvasElement,
    type: ChartType,
    labels: (string | number)[],
    data: number[],
    datasetLabel: string,
    colors: string | string[],
    aspectRatio: number
  ) {
    this.chartInstance?.destroy();

    this.chartInstance = new Chart(canvas, {
      type,
      data: {
        labels,
        datasets: [
          {
            label: datasetLabel,
            data,
            backgroundColor: colors,
            hoverOffset: type === 'pie' ? 4 : undefined,
          },
        ],
      },
      options: {
        aspectRatio,
        onClick: (_event, elements) => {
          if (!elements.length || !this.chartInstance) {
            return;
          }
          const index = elements[0].index;
          const label = this.chartInstance.data.labels?.[index];
          if (label !== undefined && label !== null) {
            this.chartClick.emit(label as string | number);
          }
        },
      },
    });
  }
}
