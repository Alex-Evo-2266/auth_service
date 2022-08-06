import { AuthLevelActions, IAuthState } from "../../interfaces/authInterfaces"

const storegeName:string = 'SHUserData';

enum AuthTypesActions {
	LOGIN = "LOGIN",
	LOGOUT = "LOGOUT",
	REFRESH = "REFRESH"
}

interface IPayload{
	token: string
	id: number
	level: AuthLevelActions
	expires_at: string
}

interface IRefreshPayload{
	token: string
	expires_at: string
}

interface ILoginAction {
	type: AuthTypesActions.LOGIN
	payload:IPayload
}

interface IRefreshAction {
	type: AuthTypesActions.REFRESH
	payload:IRefreshPayload
}

interface ILogoutAction {
	type: AuthTypesActions.LOGOUT
}

type ActionType = ILoginAction | ILogoutAction | IRefreshAction

const initialSate = ():IAuthState => {
	let datauser:string | null = localStorage.getItem(storegeName)
	if (!datauser)
		datauser = '{}';
	const data:any = JSON.parse(datauser)
	return{
		token: data?.token || '',
		id: data?.userId || null,
		level: data?.userLevel || AuthLevelActions.NONE,
		isAuthenticated: !!data.token,
		expires_at: (data?.expires_at)?new Date(data?.expires_at):new Date(),
	}
}

export const authReducer = (state:IAuthState = initialSate(), action:ActionType):IAuthState => {
	switch (action.type){
		case "LOGIN":
			localStorage.setItem(storegeName, JSON.stringify({
				userId: action.payload.id, userLevel:action.payload.level, token:action.payload.token, expires_at:action.payload.expires_at
			}))
			return {...state, token: action.payload.token, id: action.payload.id, level: action.payload.level, isAuthenticated: !!action.payload.token, expires_at: new Date(action.payload.expires_at)}
		case "REFRESH":
			console.log(state)
			localStorage.setItem(storegeName, JSON.stringify({
				...state, token:action.payload.token, expires_at:action.payload.expires_at
			}))
			return {...state, token: action.payload.token, expires_at: new Date(action.payload.expires_at)}
		case "LOGOUT":
			localStorage.removeItem(storegeName)
			fetch("/api/auth/logout", {method:"GET", body:null, headers:{"Authorization-Token": `Bearer ${state.token}`}});
			return {...state, token: '', id: null, level: AuthLevelActions.NONE, isAuthenticated: false}
		default:
			return state
	}
}