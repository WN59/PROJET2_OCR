import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
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
  private activeIndex = -1;

  readonly type = input.required<ChartType>();
  readonly labels = input.required<(string | number)[]>();
  readonly data = input.required<number[]>();
  readonly datasetLabel = input('Medals');
  readonly colors = input<string | string[]>([
    '#8f6263',
    '#9bb0c4',
    '#6b8cae',
    '#7a3c53',
    '#94819d',
    '#adc3de',
  ]);
  readonly caption = input<string>();
  readonly chartClick = output<string | number>();

  /** Id unique pour lier le canvas à sa description (aria-describedby). */
  readonly descId = `chart-desc-${crypto.randomUUID()}`;

  /** Nom court du graphique (WCAG : accessible name). */
  readonly chartName = computed(() => `${this.datasetLabel()} chart`);

  /** Données en lignes pour l’alternative textuelle structurée. */
  readonly descriptionItems = computed(() =>
    this.labels().map((label, index) => ({
      label,
      value: this.data()[index],
    }))
  );

  constructor() {
    effect(() => {
      const canvas = this.canvas()?.nativeElement;
      const labels = this.labels();
      const data = this.data();

      this.type();
      this.datasetLabel();
      this.colors();

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

  onFocus(): void {
    if (!this.labels().length) {
      return;
    }
    if (this.activeIndex < 0) {
      this.activeIndex = 0;
    }
    this.showActiveTooltip();
  }

  onBlur(): void {
    this.activeIndex = -1;
    this.chartInstance?.setActiveElements([]);
    this.chartInstance?.tooltip?.setActiveElements([], { x: 0, y: 0 });
    this.chartInstance?.update('none');
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.chartInstance) {
      return;
    }

    const count = this.labels().length;
    if (!count) {
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % count;
      this.showActiveTooltip();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + count) % count;
      this.showActiveTooltip();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const label = this.labels()[this.activeIndex];
      if (label !== undefined) {
        this.chartClick.emit(label);
      }
    }
  }

  private showActiveTooltip(): void {
    if (!this.chartInstance || this.activeIndex < 0) {
      return;
    }

    const element = this.chartInstance.getDatasetMeta(0).data[this.activeIndex];
    if (!element) {
      return;
    }

    const position = element.tooltipPosition(true);
    const active = [{ datasetIndex: 0, index: this.activeIndex }];
    this.chartInstance.setActiveElements(active);
    this.chartInstance.tooltip?.setActiveElements(active, position);
    this.chartInstance.update('none');
  }

  private createChart(canvas: HTMLCanvasElement): void {
    this.chartInstance?.destroy();
    this.activeIndex = -1;

    const type = this.type();
    const isPie = type === 'pie';

    this.chartInstance = new Chart(canvas, {
      type,
      data: {
        labels: this.labels(),
        datasets: [
          {
            label: this.datasetLabel(),
            data: this.data(),
            backgroundColor: this.colors(),
            borderWidth: isPie ? 0 : 2,
            borderColor: isPie ? undefined : '#047a82',
            hoverOffset: isPie ? 8 : undefined,
            tension: type === 'line' ? 0.25 : undefined,
            pointRadius: type === 'line' ? 4 : undefined,
            pointBackgroundColor: type === 'line' ? '#047a82' : undefined,
          },
        ],
      },
      options: {
        responsive: true,
        // Line : ratio géré par Chart.js. Pie : le cadre CSS impose la taille.
        maintainAspectRatio: !isPie,
        aspectRatio: isPie ? undefined : 2.5,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#047a82',
            titleColor: '#fff',
            bodyColor: '#fff',
            displayColors: false,
            padding: 12,
            cornerRadius: 6,
            callbacks: isPie
              ? { label: (item) => `🏅  ${item.formattedValue}` }
              : undefined,
          },
        },
        scales:
          type === 'line'
            ? {
                x: { grid: { display: false }, ticks: { color: '#595959' } },
                y: { grid: { color: '#e8e8e8' }, ticks: { color: '#595959' } },
              }
            : undefined,
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
