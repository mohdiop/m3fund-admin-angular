import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AdminDashBoardResponse, Project, ProjectOwnerResponse, ResponseError, OwnersValidationRequestResponse, ProjectsValidationRequestResponse } from '../../../models/interfaces';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Router } from '@angular/router';
import { StatsService } from '../../../services/stats-service';
import { ValidationService } from '../../../services/validation-service';
import { OwnerService } from '../../../services/owner-service';
import { PublicService } from '../../../services/public-service';
import { BaseChartDirective } from 'ng2-charts';
import { getLastFiveMonths, getProjectDomainStats, getProjectsByLast5Months } from '../../../utilities/utilities';
import { DatePipe } from '@angular/common';
import { ValidationStatePipe } from '../../../pipes/validation-state-pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProjectDomainPipe } from '../../../pipes/project-domain-pipe';

@Component({
  selector: 'app-projects',
  imports: [
    DatePipe,
    BaseChartDirective,
    ValidationStatePipe,
    PdfViewerModule,
    ProjectDomainPipe,
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
isLoading = false;
  currentDate = Date.now()
  stats: AdminDashBoardResponse | null = null
  pendingValidations: ProjectsValidationRequestResponse[] | undefined;
  showUserInfo = false;
  showConfirm = false;
  loadingForValidation = false;
  projectId = 0;
  project: Project | undefined;
  actionType: "approve" | "refuse" | undefined;
  successDialogVisible = false;
  successMessage = "";

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
            return ` Nombre de projets créés: ${ctx.raw as string}`;
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
    private validationService: ValidationService,
    private ownerService: OwnerService,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.cdr.detectChanges()
    this.statsService.getDashboardStats().subscribe(
      {
        next: (value) => {
          this.isLoading = false;
          this.stats = value;
          this.pieChartData = getProjectDomainStats(this.stats?.projects!)
          this.pieChartOptions = {
            responsive: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const label = ctx.label;
                    const value = ctx.dataset.data[ctx.dataIndex] ?? 0;

                    // Mapping label => domain count
                    const domainMap: Record<string, number> = {
                      "Agriculture": this.getDomainCount(this.stats?.projects!, "AGRICULTURE"),
                      "Élevage": this.getDomainCount( this.stats?.projects!, "BREEDING"),
                      "Éducation": this.getDomainCount( this.stats?.projects!, "EDUCATION"),
                      "Santé": this.getDomainCount( this.stats?.projects!, "HEALTH"),
                      "Mine": this.getDomainCount( this.stats?.projects!, "MINE"),
                      "Culture": this.getDomainCount( this.stats?.projects!, "CULTURE"),
                      "Environnement": this.getDomainCount( this.stats?.projects!, "ENVIRONMENT"),
                      "Informatique": this.getDomainCount( this.stats?.projects!, "COMPUTER_SCIENCE"),
                      "Solidarité": this.getDomainCount( this.stats?.projects!, "SOLIDARITY"),
                      "Commerce": this.getDomainCount( this.stats?.projects!, "SHOPPING"),
                      "Social": this.getDomainCount( this.stats?.projects!, "SOCIAL"),
                    };
                    return ` ${domainMap[label] ?? 0} projets — ${value}%`;
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
                label: "Projets",
                data: this.stats?.projects === undefined? [0,0,0,0,0] : getProjectsByLast5Months(this.stats?.projects!),
                backgroundColor: '#e6b8004f',
                hoverBackgroundColor: '#E6B800',
                barPercentage: 0.8,
                borderColor: '#E6B800',
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
    this.validationService.getAllProjectsPendingValidations().subscribe(
      {
        next: (value) => {
          this.pendingValidations = value
          this.cdr.detectChanges()
        },
        error: (error: ResponseError) => {
          console.log(error.message)
        }
      }
    );
  }

  getActiveProjects(projects: Project[] | undefined) {
    if(projects === undefined) return 0;
    return projects.filter((value) => value.isValidated).length;
  }

  isGreaterOrEqualTo(first: number | undefined, second: number | undefined): boolean {
    if(first !== undefined && second !== undefined) {
      return first >= second
    } else {
      return false
    }
  }

  showProjectInfo(ownerId: number) {
    // this.ownerService.getOwnerById(ownerId).subscribe({
    //   next: (value: ProjectOwnerResponse) => {
    //     this.project = value;
    //     this.ownerId = ownerId;
    //     this.showUserInfo = true;
    //     this.cdr.detectChanges()
    //   },
    //   error: (error: ResponseError) => {
    //     console.log(error);
    //     this.showUserInfo = false;
    //     this.cdr.detectChanges()
    //   }
    // });
  }

  hideUserInfoDialog() {
    this.showUserInfo = false;
    this.cdr.detectChanges()
  }

  showConfirmDialog(actionType: "approve" | "refuse" | undefined, projectId: number) {
    this.actionType = actionType;
    this.showConfirm = true;
    this.projectId = projectId;
    this.cdr.detectChanges()
  }

  hideConfirmValidation() {
    this.showConfirm = false;
    this.cdr.detectChanges()
  }

  validateProject() {
    this.loadingForValidation = true;
    this.validationService.validateProject(this.projectId).subscribe(
      {
        next: (value) => {
          this.loadingForValidation = false;
          this.showUserInfo = false;
          this.cdr.detectChanges()
          this.loadValidations()
          this.hideConfirmValidation()
          this.refreshPage()
          this.showSuccess("Le projet a été validé avec succès !")
        },
        error: (error: ResponseError) => {
          console.log(error.message)
          this.loadingForValidation = false;
          this.cdr.detectChanges()
        }
      }
    )
  }

  refuseProject() {
    this.loadingForValidation = true;
    this.cdr.detectChanges()
    this.validationService.refuseProject(this.projectId).subscribe(
      {
        next: (value) => {
          this.loadingForValidation = false;
          this.showUserInfo = false;
          this.cdr.detectChanges()
          this.hideConfirmValidation()
          this.refreshPage()
          this.showSuccess("Le projet a été réfusé.")
        },
        error: (error: ResponseError) => {
          console.log(error.message)
          this.loadingForValidation = false;
          this.cdr.detectChanges()
        }
      }
    )
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

  getDomainCount(projects: Project[] = [], domain: Project["domain"]): number {
    return projects.filter(p => p.domain === domain).length;
  }
}
