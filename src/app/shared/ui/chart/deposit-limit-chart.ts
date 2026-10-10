import { AfterViewInit, Component, effect, ElementRef, input, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-deposit-limit-chart',
  imports: [],
  standalone: true,
  template: `
   <div class="relative w-42 h-42">
        <canvas
            #donutCanvas
            role="img"
            [attr.aria-label]="'Deposited today: ' + depositedToday() + ', remaining: ' + remaining()">
        </canvas>
    </div>
`,
  styles: ``,
})
export class DepositLimitChart implements AfterViewInit, OnDestroy {
    depositedToday = input.required<number>();
    remaining = input.required<number>();
    balanceText = input.required<string>();
    
    chart?: Chart
    @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;
    private viewReady = false;

    constructor() {
        effect(() => {
            this.depositedToday();
            this.remaining();
            this.balanceText();

            if(this.viewReady) {
                this.createChart();
            }
        });
    }

    ngAfterViewInit(): void {
        this.viewReady = true;
        this.createChart();
    }

    ngOnDestroy(): void {
        this.chart?.destroy();
    }
    
    //Chart stuff below
    createChart() {
        const rootStyles = getComputedStyle(document.documentElement);
        const primaryColor = rootStyles.getPropertyValue('--color-primary').trim();

        this.chart?.destroy();

        this.chart = new Chart<'doughnut'>(this.donutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: ['Deposited today', 'Remaining today'],
                datasets: [{
                    data: [this.depositedToday(), this.remaining()],
                    backgroundColor: [primaryColor, '#e5e7eb'],
                    borderWidth: 2,
                    cutout: '70%'
                }] as any
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            },
            plugins: [this.centerTextPlugin]
        })
    }

    centerTextPlugin = {
        id: 'centerText',
        afterDraw: (chart: Chart) => {
            const { ctx, width, height } = chart;
            ctx.save();
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000';
            ctx.fillText(this.balanceText(), width / 2, height / 2);
            ctx.restore();
        }
    };
}
