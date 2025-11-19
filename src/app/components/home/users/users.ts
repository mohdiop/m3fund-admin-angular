import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDashBoardResponse, ResponseError, SimpleUserResponse, ValidationRequestResponse } from '../../../models/interfaces';
import { StatsService } from '../../../services/stats-service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { getLastFiveMonths, getRoleCount, getRoleDistribution, getUsersCountLastFiveMonths } from '../../../utilities/utilities';
import { ValidationService } from '../../../services/validation-service';
import { ValidationStatePipe } from '../../../pipes/validation-state-pipe';

@Component({
  selector: 'app-users',
  imports: [
    DatePipe,
    BaseChartDirective,
    ValidationStatePipe
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit, OnDestroy {

  isLoading = false;
  currentDate = Date.now()
  stats: AdminDashBoardResponse | null = null
  pendingValidations: ValidationRequestResponse[] | undefined;
  showUserInfo = false;
  showConfirm = false;
  loadingForValidation = false;
  ownerId = 0;
  actionType: "approve" | "refuse" | undefined;

  pieChartType: ChartType = 'doughnut';

  pieChartData: ChartData<'doughnut'> | undefined;

  pieChartOptions: ChartOptions | undefined;

  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            return ` Nombre d'utilisateurs inscrits: ${ctx.raw as string}`;
          }
        }
      }
    },
  };
  
  barChartData: ChartData<'bar'>| undefined;

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private statsService: StatsService,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.cdr.detectChanges()
    this.statsService.getDashboardStats().subscribe(
      {
        next: (value) => {
          this.isLoading = false;
          this.stats = value;
          const data = getRoleDistribution(this.stats?.users)
          this.pieChartData = {
            labels: ['Contributeurs', 'Porteurs', 'Admins'],
            datasets: [
              {
                data: [data.contributors, data.owners, data.admins],
                backgroundColor: ['#06A664', '#E6B800', '#2D2D2D'],
              }
            ]
          };
          this.pieChartOptions = {
            responsive: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    switch(ctx.label) {
                      case "Contributeurs": return ` ${getRoleCount(this.stats?.users, "contributors")}`;
                      case "Admins": return ` ${getRoleCount(this.stats?.users, "admins")}`;
                      case "Porteurs": return ` ${getRoleCount(this.stats?.users, "owners")}`;
                      default: return " 0";
                    }
                  }
                }
              }
            }
          };
          this.cdr.detectChanges()
          this.barChartData = {
            labels: getLastFiveMonths(),
            datasets: [
              {
                label: "Utilisateurs",
                data: this.stats?.projects === undefined? [0,0,0,0,0] : getUsersCountLastFiveMonths(this.stats?.users),
                backgroundColor: '#06a6634c',
                hoverBackgroundColor: '#06A664',
                barPercentage: 0.8,
                borderColor: '#06A664',
                borderSkipped: false,          
                borderWidth: {
                  top: 5,                       
                  right: 0,
                  bottom: 0,
                  left: 0
                },
              }
            ],
          }
          this.cdr.detectChanges()
        },
        error: (error) => {
          console.log(error.message)
          this.isLoading = false;
          this.cdr.detectChanges()
        }
      }
    );
    this.loadValidations()
  }

  ngOnDestroy(): void {
    this.cdr.detach();
  }

  refreshPage() {
    this.ngOnInit()
  }

  loadValidations() {
    this.validationService.getAllOwnersPendingValidations().subscribe(
      {
        next: (value) => {
          console.log(value)
          this.pendingValidations = value
        },
        error: (error: ResponseError) => {
          console.log(error.message)
        }
      }
    );
  }

  getActiveUsers(users: SimpleUserResponse[] | undefined) {
    if(users === undefined) return 0;
    return users.filter((value) => value.state === "ACTIVE").length;
  }

  isGreaterOrEqualTo(first: number | undefined, second: number | undefined): boolean {
    if(first !== undefined && second !== undefined) {
      return first >= second
    } else {
      return false
    }
  }

  showUserInfoDialog() {
    this.showUserInfo = true;
    this.cdr.detectChanges()
  }

  hideUserInfoDialog() {
    this.showUserInfo = false;
    this.cdr.detectChanges()
  }

  showConfirmDialog(actionType: "approve" | "refuse" | undefined, ownerId: number) {
    this.actionType = actionType;
    this.showConfirm = true;
    this.ownerId = ownerId;
    this.cdr.detectChanges()
  }

  hideConfirmValidation() {
    this.showConfirm = false;
    this.cdr.detectChanges()
  }

  validateOwner() {
    this.loadingForValidation = true;
    this.validationService.validateOwner(this.ownerId).subscribe(
      {
        next: (value) => {
          console.log(value)
          this.loadingForValidation = false;
          this.cdr.detectChanges()
          this.loadValidations()
          this.hideConfirmValidation()
          this.cdr.detectChanges()
        },
        error: (error: ResponseError) => {
          console.log(error.message)
          this.loadingForValidation = false;
          this.cdr.detectChanges()
        }
      }
    )
  }

  refuseOwner() {
    this.loadingForValidation = true;
    this.cdr.detectChanges()
    this.validationService.refuseOwner(this.ownerId).subscribe(
      {
        next: (value) => {
          console.log(value)
          this.loadingForValidation = false;
          this.cdr.detectChanges()
          this.loadValidations()
          this.hideConfirmValidation()
          this.cdr.detectChanges()
        },
        error: (error: ResponseError) => {
          console.log(error.message)
          this.loadingForValidation = false;
          this.cdr.detectChanges()
        }
      }
    )
  }

}
