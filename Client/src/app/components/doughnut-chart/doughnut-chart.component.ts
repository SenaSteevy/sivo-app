import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() rate!: number;
  @Input() startAnimation!: boolean; // New property
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @Output() panelOpened = new EventEmitter<void>(); // Emit the panelOpened event

  animatedRate: number = 0;
  chart: any;
  animationStarted: boolean = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {}
  
  ngAfterViewInit() {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rate']) {
      this.animateRate();
    }
    if (changes['startAnimation'] && this.startAnimation) {
      this.animateRate();
    }
  }
  
  initializeChart() {
    this.chart = new Chart(this.chartCanvas.nativeElement.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Rate', 'Remaining'],
        datasets: [{
          data: [this.animatedRate, 100 - this.animatedRate],
          backgroundColor: [this.getBackgroundColor(this.animatedRate), 'lightgray'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        animation: {
          animateRotate: true,
          animateScale: true
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        cutout: '80%', // Adjust the cutout value to resize the doughnut chart (percentage or pixel value)
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        }
      }
    });
  }
  

  animateRate() {
    if(this.rate == 0 ){
      return  
     }
    const increment = Math.ceil(this.rate / 30);
    let currentRate = 0;

    const animation = setInterval(() => {
      currentRate += increment;
      this.animatedRate = Math.min(currentRate, this.rate);

      this.chart.data.datasets[0].data = [this.animatedRate, 100 - this.animatedRate];
      this.chart.data.datasets[0].backgroundColor = [this.getBackgroundColor(this.animatedRate), 'lightgray'];
      this.chart.update();

      if (currentRate >= this.rate) {
        clearInterval(animation);
      }
    }, 25);
  }

  getBackgroundColor(rate: number): string {
    if (rate > 90) {
      return 'green';
    } else if (rate > 45) {
      return 'orange';
    } else {
      return 'red';
    }
  }
}
