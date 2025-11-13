export interface AuthRequest {
    email: string,
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