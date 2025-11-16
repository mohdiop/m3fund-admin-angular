import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats-service';
import { AdminDashBoardResponse, ResponseError } from '../../../models/interfaces';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { ChartOptions, ChartData, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { getLastFiveMonths, getProjectsCountLastFiveMonths, getUsersCountLastFiveMonths } from '../../../utilities/utilities';
import { NumberSpacesPipe } from '../../../pipes/number-spaces-pipe-pipe';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    BaseChartDirective,
    NumberSpacesPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  stats: AdminDashBoardResponse | null = null
  isLoading = false;
  currentDate = Date.now()
  selectedGraph = 0

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
        this.cdr.detectChanges()
      },
      error: (error: ResponseError) => {
        console.log(error.message)
        this.isLoading = false;
        this.cdr.detectChanges()
      }
    });
  }

  ngOnDestroy(): void {
    this.cdr.detach()
  }

  constructor(
    private statsService: StatsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  isGreaterOrEqualTo(first: number | undefined, second: number | undefined): boolean {
    if(first && second) {
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
}
