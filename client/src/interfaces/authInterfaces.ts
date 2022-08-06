export enum AuthLevelActions {
	ADMIN = 3,
	MID = 2,
	USER = 1,
	NONE = 0
}

export interface IAuthState{
  token: string,
  id: number | null,
  level: AuthLevelActions,
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

export interface INewPass{
	old_password: string
	new_password: string
}