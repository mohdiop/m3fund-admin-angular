import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AdminDashBoardResponse, Payment, PendingForDisbursingCampaign, ResponseError, SystemResponse } from '../../../models/interfaces';
import { StatsService } from '../../../services/stats-service';
import { SystemService } from '../../../services/system-service';
import { DatePipe } from '@angular/common';
import { CampaignService } from '../../../services/campaign-service';
import { NumberSpacesPipe } from '../../../pipes/number-spaces-pipe-pipe';
import { aggregatePaymentsByMode } from '../../../utilities/utilities';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { PublicService } from '../../../services/public-service';
import { SuccessDialog } from '../../customs/success-dialog/success-dialog';
echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-payments',
  imports: [
    DatePipe,
    NumberSpacesPipe,
    NgxEchartsDirective,
    ReactiveFormsModule,
    SuccessDialog
  ],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class Payments implements OnInit, OnDestroy {

  stats: AdminDashBoardResponse | undefined;
  system: SystemResponse | undefined;
  pendingCampaigns: PendingForDisbursingCampaign[] | undefined;
  usersProfiles = new Map<number, string>();
  isLoading = false;
  showConfirm = false;
  loadingForDisbursing = false;
  successDialogVisible = false;
  successMessage = "";
  disbursingCampaignId = 0;
  disbursingAmount = 0.0;
  ownerName = "";
  currentDate = Date.now()
  totalToDisburse: number = 0.0;
  cashedPaymentsChartData: { labels: string[] , data: number[] } | undefined
  disbursedPaymentsChartData: { labels: string[] , data: number[] } | undefined
  totalPaymentsChartData: { labels: string[] , data: number[] } | undefined
  paymentChartType: "daily" | "monthly" | "yearly" = "daily"
  paymentChartArea: "cashed" | "disbursed" | "total" = "total"
  paymentChartTypeControl = new FormControl(this.paymentChartType);
  orderBys: "maxAmount" | "minAmount" | "recentlyFinished" | "oldestFinished" = "maxAmount";
  campaignOrderBYControl = new FormControl(this.orderBys);
  options: echarts.EChartsCoreOption = {}

  constructor(
    private statsService: StatsService,
    private systemService: SystemService,
    private cdr: ChangeDetectorRef,
    private campaignService: CampaignService,
    private publicService: PublicService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.statsService.getDashboardStats().subscribe({
      next: (value: AdminDashBoardResponse) => {
        this.stats = value;
        this.cdr.detectChanges()
        this.updatePaymentsOptions(this.paymentChartArea, this.paymentChartType)
      },
      error: (error: ResponseError) => {
        console.log(error.message)
      },
      complete: () => {
        this.isLoading = false
        this.cdr.detectChanges()
      }
    })
    this.systemService.getSystemInfo().subscribe({
      next: (value: SystemResponse) => {
        this.system = value;
        this.cdr.detectChanges()
      },
      error: (error: ResponseError) => {
        console.log(error)
      }
    })
    this.campaignService.getPendingForDisbursingCampaigns().subscribe({
      next: (value: PendingForDisbursingCampaign[]) => {
        this.pendingCampaigns = value;
        this.totalToDisburse = 0.0;
        for(const campaign of value) {
          this.totalToDisburse += campaign.amountToDisburse;
          if(campaign.projectOwnerPictureUrl !== undefined && campaign.projectOwnerPictureUrl != null && campaign.projectOwnerPictureUrl !== "") {
            this.publicService.downloadFile(campaign.projectOwnerPictureUrl).subscribe({
              next: (value: Blob) => {
                this.usersProfiles.set(campaign.id, URL.createObjectURL(value))
                this.cdr.detectChanges()
              }
            })
          }
        }
        this.cdr.detectChanges();
      },
      error: (error: ResponseError) => {
        console.log(error.message);
      }
    })
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

  showConfirmDialog(campaignId: number, amount: number, ownerName: string) {
    this.disbursingCampaignId = campaignId;
    this.disbursingAmount = amount;
    this.ownerName = ownerName;
    this.showConfirm = true;
    this.cdr.detectChanges()
  }

  hideConfirmDialog() {
    this.showConfirm = false;
    this.cdr.detectChanges()
  }

  showSuccess(message: string) {
    this.successMessage = message;
    this.successDialogVisible = true;
    this.cdr.detectChanges();
  }

  closeSuccessDialog() {
    this.successDialogVisible = false;
    this.cdr.detectChanges();
  }

  refreshPage() {
    this.ngOnInit()
  }

  isGreaterOrEqualTo(first: number | undefined, second: number | undefined): boolean {
    if(first !== undefined && second !== undefined) {
      return first >= second
    } else {
      return false
    }
  }

  selectPaymentArea(area: "cashed" | "disbursed" | "total") {
    this.updatePaymentsOptions(area, this.paymentChartType);
    this.paymentChartArea = area;
    this.cdr.detectChanges()
  }

  disburseCampaign(campaignId: number) {
    this.loadingForDisbursing = true;
    this.campaignService.disburse(campaignId).subscribe({
      next: (value) => {
        this.showSuccess("Décaissement effectué avec succès!");
        this.ngOnInit()
      },
      error: (error: ResponseError) => {
        console.log(error.message);
      },
      complete: () => {
        this.loadingForDisbursing = false;
        this.showConfirm = false;
        this.cdr.detectChanges()
      }
    })
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
