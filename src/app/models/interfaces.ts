export interface AuthRequest {
    username: string,
    password: string,
    platform: string
}

export interface ResponseError {
    code: string,
    message: string,
    timestamp: string
}

export interface TokenPair {
    accessToken: string,
    refreshToken: string
}

export interface AdminResponse {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  state: string,
  roles: string[],
  createdAt: string
}

export interface SimpleUserResponse {
  id: number;
  state: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  roles: ["ROLE_PROJECT_OWNER" |
    "ROLE_CONTRIBUTOR" |
    "ROLE_SUPER_ADMIN" |
    "ROLE_VALIDATIONS_ADMIN" |
    "ROLE_PAYMENTS_ADMIN" |
    "ROLE_USERS_ADMIN" |
    "ROLE_SYSTEM"]
  createdAt: string;
}

export interface Payment {
  id: number;
  transactionId: string;
  type: "ORANGE_MONEY" | "PAYPAL" | "BANK_CARD" | "MOOV_MONEY";
  state: "SUCCESS" | "FAILED" | "PENDING";
  madeAt: string;
  amount: number;
  projectName: string;
  strategy: "CASHED" | "DISBURSED";
}

export interface Project {
  id: number;
  name: string;
  description: string;
  resume: string;
  objective: string;
  domain: "AGRICULTURE" |
    "BREEDING" |
    "EDUCATION" |
    "HEALTH" |
    "MINE" |
    "CULTURE" |
    "ENVIRONMENT" |
    "COMPUTER_SCIENCE" |
    "SOLIDARITY" |
    "SHOPPING" |
    "SOCIAL";
  websiteLink: string;
  imagesUrl: string[];
  videoUrl: string;
  businessPlanUrl: string;
  launchedAt: string;
  createdAt: string; 
  isValidated: boolean;
}

export interface AdminDashBoardResponse {
  totalActiveUsers: number;
  monthlyNewUsers: number;
  usersCurrentMonthScore: number;
  usersLastMonthScore: number;
  totalActiveProjects: number;
  monthlyNewProjects: number;
  projectsCurrentMonthScore: number;
  projectsLastMonthScore: number;
  actualFund: number;
  totalFund: number;
  payments: Payment[];
  projects: Project[];
  users: SimpleUserResponse[];
}

export interface RoleDistribution {
  owners: number;
  contributors: number;
  admins: number;
}

export interface SimpleOwnerResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: "INDIVIDUAL" | "ASSOCIATION" | "ORGANIZATION";
  profilePicture?: string;
}

export interface ValidationRequestResponse {
  id: number;
  owner: SimpleOwnerResponse;
  date: string;
  state: "PENDING" | "APPROVED" | "REFUSED"
}

export interface OwnerDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  annualIncome: number;
  profilePictureUrl: string | null;
  biometricCardUrl: string | null;
  residenceCertificateUrl: string | null;
  bankStatementUrl: string | null;
  type: "INDIVIDUAL" | "ASSOCIATION" | "ORGANIZATION";
  state: "ACTIVE" | "INACTIVE" | "SUSPENDED";   
  createdAt: string;
  roles: string[];
}

export type Preview = {
  kind: 'pdf' | 'image' | 'other';
  objectUrl: string;
  name?: string;
};

export type UserRole = 
  "ROLE_PROJECT_OWNER" |
    "ROLE_CONTRIBUTOR" |
    "ROLE_SUPER_ADMIN" |
    "ROLE_VALIDATIONS_ADMIN" |
    "ROLE_PAYMENTS_ADMIN" |
    "ROLE_USERS_ADMIN" |
    "ROLE_SYSTEM";

export type ProjectOwnerType =
  | "INDIVIDUAL"
  | "ASSOCIATION"
  | "ORGANIZATION";

export interface ProjectOwnerResponse {
  id: number;

  // COMMON FIELDS (present for all types)
  email: string;
  phone: string;
  address: string;
  annualIncome: number;
  type: ProjectOwnerType;
  state: string;
  createdAt: string;
  roles: UserRole[];

  // INDIVIDUAL ONLY
  firstName?: string | null;
  lastName?: string | null;
  biometricCardUrl?: string | null;
  residenceCertificateUrl?: string | null;

  // ASSOCIATION & ORGANIZATION
  entityName?: string | null;

  // ASSOCIATION ONLY
  associationStatusUrl?: string | null;
  shareCapital?: number;

  // ORGANIZATION ONLY
  rccmUrl?: string | null;

  // COMMON OPTIONAL FILES
  logoUrl?: string | null;
  profilePictureUrl?: string | null;
  bankStatementUrl?: string | null;
}