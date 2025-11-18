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
  id: number,
  createdAt: string
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
