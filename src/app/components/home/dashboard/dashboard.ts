import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats-service';
import { AdminDashBoardResponse, Payment, ResponseError, SystemResponse } from '../../../models/interfaces';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { ChartOptions, ChartData, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { aggregatePaymentsByMode, getLastFiveMonths, getProjectsCountLastFiveMonths, getUsersCountLastFiveMonths } from '../../../utilities/utilities';
import { NumberSpacesPipe } from '../../../pipes/number-spaces-pipe-pipe';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SystemService } from '../../../services/system-service';
echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    BaseChartDirective,
    NumberSpacesPipe,
    NgxEchartsDirective,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [provideEchartsCore({ echarts })],
})
export class Dashboard implements OnInit, OnDestroy {

  stats: AdminDashBoardResponse | null = null
  system: SystemResponse | undefined;
  isLoading = false;
  currentDate = Date.now()
  selectedGraph = 0
  cashedPaymentsChartData: { labels: string[] , data: number[] } | undefined
  disbursedPaymentsChartData: { labels: string[] , data: number[] } | undefined
  totalPaymentsChartData: { labels: string[] , data: number[] } | undefined
  paymentChartType: "daily" | "monthly" | "yearly" = "daily"
  paymentChartArea: "cashed" | "disbursed" | "total" = "total"
  paymentChartTypeControl = new FormControl(this.paymentChartType);

  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        display: true, 
        position: 'bottom',
        labels: {
        generateLabels: (chart) => {
          const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
          labels.forEach(label => {
            label.borderRadius = 3;
          });
          return labels;
        }
      },
      }
    },
    scales: {
      yProjects: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: { display: true, text: 'Projets' },
        grid: { drawOnChartArea: false }
      },
      yUsers: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        title: { display: true, text: 'Utilisateurs' },
        grid: { drawOnChartArea: false },
      }
    }
  };

  barChartData: ChartData<'bar'>| undefined;

  options: echarts.EChartsCoreOption = {}

  ngOnInit(): void {
    this.isLoading = true;
    this.cdr.detectChanges()
    this.statsService.getDashboardStats().subscribe({
      next: (value: AdminDashBoardResponse) => {
        this.stats = value
        this.isLoading = false;
        this.cdr.detectChanges()
        this.barChartData = {
          labels: getLastFiveMonths(),
          datasets: [
            {
              yAxisID: "yProjects",
              label: "Projets",
              data: this.stats?.projects === undefined? [0,0,0,0,0] : getProjectsCountLastFiveMonths(this.stats?.projects),
              backgroundColor: '#06A664',
              hoverBackgroundColor: '#06a66380',
              borderRadius: 5,
              barPercentage: 0.8,
            },
            {
              yAxisID: "yUsers",
              label: "Utilisateurs",
              data: this.stats?.users === undefined? [0,0,0,0,0] : getUsersCountLastFiveMonths(this.stats?.users),
              backgroundColor: '#E6B800',
              hoverBackgroundColor: 'rgba(230, 184, 0, 0.5)',
              borderRadius: 5,
              barPercentage: 0.8,
            }
          ],
        }
        this.updatePaymentsOptions(this.paymentChartArea, this.paymentChartType)
      },
      error: (error: ResponseError) => {
        console.log(error.message)
        this.isLoading = false;
        this.cdr.detectChanges()
      }
    });
    this.paymentChartTypeControl.valueChanges.subscribe((value) => {
      console.log(value)
      switch(value) {
        case 'daily': {this.paymentChartType = 'daily'; break;}
        case 'monthly': {this.paymentChartType = 'monthly'; break;}
        case 'yearly': {this.paymentChartType = 'yearly'; break;}
        default: {this.paymentChartType = "daily"; break;}
      }
      this.updatePaymentsOptions(this.paymentChartArea, this.paymentChartType)
    });
    this.systemService.getSystemInfo().subscribe({
      next: (value: SystemResponse) => {
        this.system = value;
        this.cdr.detectChanges()
      },
      error: (error: ResponseError) => {
        console.log(error.message)
      }
    })
  }

  ngOnDestroy(): void {
    this.cdr.detach()
  }

  constructor(
    private statsService: StatsService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private systemService: SystemService
  ) {}

  isGreaterOrEqualTo(first: number | undefined, second: number | undefined): boolean {
    if(first !== undefined && second !== undefined) {
      return first >= second
    } else {
      return false
    }
  }

  goToPage(path: string) {
    this.router.navigateByUrl(path)
  }

  refreshPage() {
    this.ngOnInit()
  }

  selectGraph(i: number) {
    this.selectedGraph = i;
    this.cdr.detectChanges()
  }

  selectPaymentArea(area: "cashed" | "disbursed" | "total") {
    this.updatePaymentsOptions(area, this.paymentChartType);
    this.paymentChartArea = area;
    this.cdr.detectChanges()
  }

  updatePaymentsOptions(strategy: "cashed" | "disbursed" | "total" ,type: "daily" | "monthly" | "yearly") {
    if(this.stats?.payments === undefined) {
      return;
    }
    const paymentsCashed: Payment[] = this.stats?.payments.filter((value) => value.strategy === "CASHED")
    const paymentsDisbursed: Payment[] = this.stats?.payments.filter((value) => value.strategy === "DISBURSED")
    this.cashedPaymentsChartData = aggregatePaymentsByMode(paymentsCashed, type)
    this.disbursedPaymentsChartData = aggregatePaymentsByMode(paymentsDisbursed, type)
    this.totalPaymentsChartData = aggregatePaymentsByMode(this.stats?.payments, type)
    var series: any[] = []
    switch(strategy) {
      case 'cashed': {
        series = [{
        data: this.cashedPaymentsChartData.data,
        type: 'line',
        smooth: true,
        showSymbol: false,         
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 4,
          color: '#06A664'
        },
        itemStyle: {
          color: '#06A664'
        }
      }]
     break; 
      }
      case 'disbursed': {
        series = [{
        data: this.disbursedPaymentsChartData.data,
        type: 'line',
        smooth: true,
        showSymbol: false,         
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 4,
          color: '#E6B800'
        },
        itemStyle: {
          color: '#E6B800'
        }
      } ]
      break
      }
      case 'total': {
        series = [{
        data: this.cashedPaymentsChartData.data,
        type: 'line',
        smooth: true,
        showSymbol: false,         
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 4,
          color: '#06A664'
        },
        itemStyle: {
          color: '#06A664'
        }
      }, {
        data: this.disbursedPaymentsChartData.data,
        type: 'line',
        smooth: true,
        showSymbol: false,         
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 4,
          color: '#E6B800'
        },
        itemStyle: {
          color: '#E6B800'
        }
      } ]
      break;
      }
    }
    this.options = {
      legend: { show: false },
      tooltip: {
        trigger: 'axis',           
        backgroundColor: '#2d2d2d',
        borderRadius: 10,
        borderWidth: 1,
        textStyle: {
          color: '#fff'
        }
      },

      xAxis: {
        type: 'category',
        data: this.totalPaymentsChartData.labels,
        axisLine: { lineStyle: { color: '#2d2d2d' } },
        axisTick: { show: false },
        splitLine: { show: true }
      },

      yAxis: {
        type: 'value',
        min: 0,
        axisLine: { show: true },
        axisTick: { show: true },
        splitLine: { show: false },
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1_000_000) {
              return (value / 1_000_000).toFixed(1).replace('.', ',') + 'M';
            } 
            if (value >= 1_000) {
              return (value / 1_000).toFixed(1).replace('.', ',') + 'k';
            }
            return value.toString();
          }
        }
      },

      series: series,

      grid: { left: 0, right: 0, bottom: 0, top: 0 }
    };
    this.cdr.detectChanges()
  }
}
