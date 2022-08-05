export interface IAuthState{
  token: string,
  id: number | null,
  level: null | number,
  isAuthenticated: boolean
  expires_at: Date
}

export interface ISession{
	id: number
	client_name: string
	entry_time: Date
	host: string
	platform: string
  }